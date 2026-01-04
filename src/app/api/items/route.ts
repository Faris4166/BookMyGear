import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'items.json');

// ดึงข้อมูลสินค้าทั้งหมด
export async function GET() {
    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        return NextResponse.json(JSON.parse(fileContent));
    } catch (error) {
        return NextResponse.json({ error: "Load failed" }, { status: 500 });
    }
}

// เพิ่มสินค้าใหม่
export async function POST(request: Request) {
    try {
        const newItem = await request.json();
        const fileContent = await fs.readFile(filePath, 'utf8');
        const items = JSON.parse(fileContent);

        const itemWithId = { ...newItem, id: Date.now().toString() };
        items.push(itemWithId);

        await fs.writeFile(filePath, JSON.stringify(items, null, 2));
        return NextResponse.json(itemWithId, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add item' }, { status: 500 });
    }
}

// แก้ไขสินค้าเดิม
export async function PATCH(request: Request) {
    try {
        const updatedItem = await request.json();
        const fileContent = await fs.readFile(filePath, 'utf8');
        let items = JSON.parse(fileContent);

        const index = items.findIndex((item: any) => item.id === updatedItem.id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updatedItem };
            await fs.writeFile(filePath, JSON.stringify(items, null, 2));
            return NextResponse.json(items[index]);
        }
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
    }
}