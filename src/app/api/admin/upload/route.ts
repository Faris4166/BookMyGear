import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // กำหนดตำแหน่งเซฟไฟล์ (public/upload)
        const fileName = `${Date.now()}-${file.name}`;
        const uploadDir = path.join(process.cwd(), 'public', 'upload');
        const uploadPath = path.join(uploadDir, fileName);

        // ตรวจสอบและสร้างโฟลเดอร์ถ้าไม่มี
        await fs.mkdir(uploadDir, { recursive: true });

        await fs.writeFile(uploadPath, buffer);

        // คืนค่า path สำหรับเก็บใน JSON (เริ่มจาก /upload/...)
        return NextResponse.json({ url: `/upload/${fileName}` });
    } catch (error) {
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}