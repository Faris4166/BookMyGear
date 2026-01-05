import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function PATCH(request: Request) {
    try {
        const { orderId, newStatus } = await request.json();
        
        if (!orderId || !['Approved', 'Rejected'].includes(newStatus)) {
            return NextResponse.json({ error: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 });
        }

        const dataDir = path.join(process.cwd(), 'data');
        const orderPath = path.join(dataDir, 'order.json');
        const itemsPath = path.join(dataDir, 'items.json');
        
        // Ensure files exist
        try {
            await fs.access(orderPath);
            await fs.access(itemsPath);
        } catch {
            return NextResponse.json({ error: 'ไม่พบฐานข้อมูล' }, { status: 500 });
        }

        const orders = JSON.parse(await fs.readFile(orderPath, 'utf8'));
        const orderIndex = orders.findIndex((o: any) => o.id === orderId);

        if (orderIndex === -1) return NextResponse.json({ error: 'ไม่พบรายการที่ระบุ' }, { status: 404 });
        
        // Prevent re-processing
        if (orders[orderIndex].status !== 'Pending') {
            return NextResponse.json({ error: 'รายการนี้ถูกดำเนินการไปแล้ว' }, { status: 400 });
        }

        const items = JSON.parse(await fs.readFile(itemsPath, 'utf8'));
        const itemIndex = items.findIndex((i: any) => i.id === orders[orderIndex].itemId || i.name === orders[orderIndex].name);

        if (newStatus === 'Approved') {
            if (itemIndex !== -1) {
                if (items[itemIndex].stock > 0) {
                    items[itemIndex].stock -= 1;
                } else {
                    return NextResponse.json({ error: `อุปกรณ์ "${items[itemIndex].name}" สต็อกหมดไม่สามารถอนุมัติได้` }, { status: 400 });
                }
            } else {
                return NextResponse.json({ error: 'ไม่พบอุปกรณ์ที่อ้างถึงในระบบ' }, { status: 404 });
            }
            orders[orderIndex].role = 'ได้รับอนุญาตแล้ว';
        } else {
            orders[orderIndex].role = 'ไม่ได้รับอนุญาต';
        }

        orders[orderIndex].status = newStatus;

        await fs.writeFile(orderPath, JSON.stringify(orders, null, 2));
        await fs.writeFile(itemsPath, JSON.stringify(items, null, 2));

        return NextResponse.json({ message: 'Success' });
    } catch (error) { 
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }); 
    }
}