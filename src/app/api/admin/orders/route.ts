import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
    const { userId } = await auth();
    // ควรเช็ค Role ว่าเป็น Admin ไหม แต่ตอนนี้เช็คแค่ Login ก่อน
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ดึงข้อมูล Orders พร้อม Join กับ Items เพื่อเอาชื่อสินค้าและรูป
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            items (
                name,
                img
            )
        `)
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    
    return NextResponse.json(data);
}