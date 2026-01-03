import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function PATCH(request: Request) {
    try {
        const { orderId, newStatus } = await request.json();
        const filePath = path.join(process.cwd(), 'data', 'order.json');
        
        // 1. อ่านข้อมูลทั้งหมด
        const fileContent = await fs.readFile(filePath, 'utf8');
        let orders = JSON.parse(fileContent);

        // 2. ค้นหาและแก้ไขสถานะ
        const orderIndex = orders.findIndex((o: any) => o.id === orderId);
        if (orderIndex === -1) {
            return NextResponse.json({ error: 'ไม่พบรายการจอง' }, { status: 404 });
        }

        orders[orderIndex].status = newStatus; // เช่น 'Approved'
        orders[orderIndex].role = 'ได้รับอนุญาตจาก Admin แล้ว'; // แก้ไขข้อความเพิ่มเติม

        // 3. บันทึกกลับลงไฟล์
        await fs.writeFile(filePath, JSON.stringify(orders, null, 2), 'utf8');

        return NextResponse.json({ message: 'อัปเดตสถานะสำเร็จ' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการอัปเดต' }, { status: 500 });
    }
}