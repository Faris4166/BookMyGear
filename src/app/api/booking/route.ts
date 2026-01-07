import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function POST(request: Request) {
    // 1. ตรวจสอบสิทธิ์
    const user = await currentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { itemId, startDate, endDate } = body;

        // Validation
        if (!itemId || !startDate || !endDate) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // 2. บันทึกการจองลง Supabase
        const { data, error } = await supabase
            .from('orders')
            .insert([{
                user_id: user.id,
                user_name: `${user.firstName} ${user.lastName}`, // เก็บชื่อไว้ดูง่ายๆ
                item_id: itemId,
                start_date: startDate,
                end_date: endDate,
                status: 'pending' // สถานะเริ่มต้น
            }])
            .select();

        if (error) throw error;

        // 3. (Optional) ตัดสต็อกสินค้าทันที หรือจะไปตัดตอนอนุมัติก็ได้
        // ตรงนี้ขอเว้นไว้ก่อน เพื่อความง่ายในการจัดการ

        return NextResponse.json(data[0], { status: 201 });

    } catch (error: any) {
        console.error("Booking Error:", error);
        return NextResponse.json({ error: "Failed to book item" }, { status: 500 });
    }
}