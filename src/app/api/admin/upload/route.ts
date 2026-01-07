import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

        // ตรวจสอบขนาดไฟล์ (จำกัดที่ 3MB)
        const MAX_SIZE = 3 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: "File too large. Maximum size is 3MB." }, { status: 400 });
        }

        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
            .from('images')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return NextResponse.json({ error: "Upload to Supabase failed: " + error.message }, { status: 500 });
        }

        // ดึง Public URL ของรูปภาพ
        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(fileName);

        return NextResponse.json({ url: publicUrl });
    } catch (error: any) {
        console.error('Upload catch error:', error);
        return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
    }
}