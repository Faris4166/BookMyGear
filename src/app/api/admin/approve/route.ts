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

        // *ฟีเจอร์: ถ้า Approved ให้ไปลด Stock ในตาราง items*
        if (status === 'approved') {
            const order = data[0];
            if (order && order.item_id) {
                // ดึง stock ปัจจุบัน
                const { data: itemData, error: itemError } = await supabase
                    .from('items')
                    .select('stock')
                    .eq('id', order.item_id)
                    .single();
                
                if (!itemError && itemData && itemData.stock > 0) {
                    await supabase
                        .from('items')
                        .update({ stock: itemData.stock - 1 })
                        .eq('id', order.item_id);
                }
            }
        }

        return NextResponse.json(data[0]);

    } catch (error: any) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}