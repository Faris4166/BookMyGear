import React from 'react'
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import ClientHistory from './ClientHistory';

export const dynamic = 'force-dynamic'

export default async function HistoryUser() {
  const { userId } = await auth();

  if (!userId) {
    // สามารถ redirect ไปหน้า login หรือแสดง message
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Please sign in to view your history.</p>
      </div>
    )
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items (
        name,
        img,
        description
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return <div>Error loading history</div>;
  }

  const formattedData = data.map((order: any) => ({
    ...order,
    name: order.items?.name,
    img: order.items?.img,
    description: order.items?.description,
    datastart: order.start_date,
    dataend: order.end_date,
    role: order.status === 'approved' ? 'ได้รับอนุญาตแล้ว' :
      order.status === 'rejected' ? 'ไม่ได้รับอนุญาต' :
        order.status === 'pending' ? 'รอการอนุญาต' : order.status
  }));

  // ไม่ต้องใช้ Suspense ที่นี่เพราะมี loading.tsx ใน folder แล้ว
  return (
    <ClientHistory initialOrders={formattedData || []} />
  );
}