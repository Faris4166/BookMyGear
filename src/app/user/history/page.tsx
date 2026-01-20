import React from 'react'
import { auth } from '@clerk/nextjs/server';
import ClientHistory from './ClientHistory';
import { getCachedUserOrders } from '@/lib/cache';

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

  // ดึงข้อมูลผ่าน Cache Utility
  const orders = await getCachedUserOrders(userId);

  // ไม่ต้องใช้ Suspense ที่นี่เพราะมี loading.tsx ใน folder แล้ว
  return (
    <ClientHistory initialOrders={orders || []} />
  );
}