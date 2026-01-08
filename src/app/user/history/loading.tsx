import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  // สร้าง Array สมมติขึ้นมา 5 รายการเพื่อแสดง Skeleton หลายๆ อัน
  const skeletonCards = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ส่วนหัวข้อ History */}
      <Skeleton className="h-10 w-40" /> 

      <div className="space-y-4">
        {skeletonCards.map((index) => (
          <div key={index} className="border rounded-xl px-4 py-6 bg-card flex flex-col gap-4">
            <div className="flex items-center gap-4">
              {/* รูปภาพจำลอง */}
              <Skeleton className="w-12 h-12 rounded-lg" />
              
              <div className="space-y-2">
                {/* ชื่อสินค้าจำลอง */}
                <Skeleton className="h-5 w-48" />
                {/* Badge จำลอง */}
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}