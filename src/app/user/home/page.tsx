import React from 'react'
import { supabase } from '@/lib/supabase';
import ClientUserHome from './ClientUserHome';

export const dynamic = 'force-dynamic'

export default async function UserHomePage() {
  // ดึงข้อมูลจาก Supabase โดยตรงใน Server Component
  const { data: items, error } = await supabase
    .from('items')
    .select('id, name, img, stock, description, category, role');

  if (error) {
    console.error('Error fetching items:', error);
    return <div>Error loading items</div>;
  }

  // ไม่ต้องใช้ Suspense ที่นี่เพราะ Next.js จะใช้ loading.tsx ให้เอง
  return (
    <ClientUserHome initialItems={items || []} />
  );
}