import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(request: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { orderId, newStatus } = await request.json();
        const status = newStatus?.toLowerCase();

        if (!['approved', 'rejected', 'returned', 'pending'].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }


        // อัปเดตสถานะ
        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId)
            .select();

        if (error) throw error;

        // *ฟีเจอร์เสริม: ถ้า Approved ให้ไปลด Stock ในตาราง items*
        if (status === 'approved') {
            // ดึง item_id จาก order นี้มาก่อน
            const order = data[0];
            /* Logic ลดสต็อก: 
               คุณสามารถเขียน RPC Function ใน Supabase หรือทำตรงนี้แบบง่ายๆ
               await supabase.rpc('decrement_stock', { item_id: order.item_id });
            */
        }

        return NextResponse.json(data[0]);

    } catch (error: any) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}