import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic'; // เพิ่มบรรทัดนี้เพื่อให้อ่านไฟล์ใหม่ทุกครั้ง

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'data', 'order.json');
        const fileContent = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(fileContent);
        // แนะนำให้ reverse ข้อมูลเพื่อให้รายการจองใหม่ล่าสุดอยู่ด้านบน
        return NextResponse.json(Array.isArray(data) ? data.reverse() : []);
    } catch (error) {
        return NextResponse.json([]);
    }
}