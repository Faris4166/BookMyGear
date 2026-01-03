import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// บังคับให้ Fetch ข้อมูลใหม่เสมอ ไม่ใช้ Cache
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'data', 'order.json');
        const fileContent = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(fileContent);
        
        // ส่งข้อมูลกลับไป (เรียงจากใหม่ไปเก่า)
        return NextResponse.json(Array.isArray(data) ? data.reverse() : []);
    } catch (error) {
        // หากไม่พบไฟล์ ให้ส่ง Array ว่างกลับไปแทน 404
        return NextResponse.json([]);
    }
}