import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const filePath = path.join(process.cwd(), 'data', 'order.json');
        
        let orders = [];
        try {
            const fileContent = await fs.readFile(filePath, 'utf8');
            orders = JSON.parse(fileContent);
        } catch (error) {
            orders = [];
        }

        // สร้าง Object ข้อมูลการจองใหม่
        const newOrder = {
            ...data,
            id: Date.now().toString(), // สร้าง ID แบบสุ่มจากเวลา
            status: 'Pending',         // กำหนดสถานะเริ่มต้นเป็น "รอการอนุญาต"
            createdAt: new Date().toISOString()
        };

        orders.push(newOrder);
        await fs.writeFile(filePath, JSON.stringify(orders, null, 2), 'utf8');

        return NextResponse.json({ message: 'Success', order: newOrder }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
    }
}