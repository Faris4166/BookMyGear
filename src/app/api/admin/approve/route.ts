import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function PATCH(request: Request) {
    try {
        const { orderId, newStatus } = await request.json();
        const orderPath = path.join(process.cwd(), 'data', 'order.json');
        const itemsPath = path.join(process.cwd(), 'data', 'items.json');
        
        const orders = JSON.parse(await fs.readFile(orderPath, 'utf8'));
        const orderIndex = orders.findIndex((o: any) => o.id === orderId);

        if (orderIndex === -1) return NextResponse.json({ error: 'ไม่พบรายการ' }, { status: 404 });
        if (orders[orderIndex].status === 'Approved') return NextResponse.json({ error: 'อนุมัติไปแล้ว' }, { status: 400 });

        // ลดสต็อก
        const items = JSON.parse(await fs.readFile(itemsPath, 'utf8'));
        const itemIndex = items.findIndex((i: any) => i.id === orders[orderIndex].itemId || i.name === orders[orderIndex].name);

        if (itemIndex !== -1) {
            if (items[itemIndex].stock > 0) {
                items[itemIndex].stock -= 1;
            } else {
                return NextResponse.json({ error: 'สต็อกหมด' }, { status: 400 });
            }
        }

        orders[orderIndex].status = newStatus;
        orders[orderIndex].role = 'ได้รับอนุญาตแล้ว';

        await fs.writeFile(orderPath, JSON.stringify(orders, null, 2));
        await fs.writeFile(itemsPath, JSON.stringify(items, null, 2));

        return NextResponse.json({ message: 'Success' });
    } catch (error) { return NextResponse.json({ error: 'Error' }, { status: 500 }); }
}