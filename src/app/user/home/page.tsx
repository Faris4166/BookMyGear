import React from 'react'
import { getCachedItems } from '@/lib/cache';
import ClientUserHome from './ClientUserHome';

export default async function UserHomePage() {
  // ดึงข้อมูลผ่าน Cache Utility
  const items = await getCachedItems();

  // ไม่ต้องใช้ Suspense ที่นี่เพราะ Next.js จะใช้ loading.tsx ให้เอง
  return (
    <ClientUserHome initialItems={items || []} />
  );
}