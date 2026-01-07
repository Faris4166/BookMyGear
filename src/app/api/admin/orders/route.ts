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
    
    // แปลงข้อมูลให้ตรงกับที่ Frontend รอรับ
    const formattedOrders = data.map((order: any) => ({
        id: order.id,
        userId: order.user_id,
        userName: order.user_name,
        name: order.items?.name || 'Unknown Item',
        img: order.items?.img,
        category: order.items?.category || 'General',
        datastart: order.start_date,
        dataend: order.end_date,
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1), // 'pending' -> 'Pending'
        createdAt: order.created_at
    }));
    
    return NextResponse.json(formattedOrders);
}