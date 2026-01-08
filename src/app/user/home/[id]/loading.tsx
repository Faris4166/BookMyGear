"use client"
import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Loading() {
  // สร้าง Array สมมติ 8 รายการเพื่อให้เต็มหน้าแรก (ตาม itemsPerPage = 8)
  const skeletonCards = Array.from({ length: 8 });

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
      {/* --- Header Skeleton --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[150px]" /> {/* สำหรับ Title "Home" */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-[200px]" /> {/* สำหรับ Welcome Message */}
          </div>
        </div>
      </div>

      <Separator />

      {/* --- Search & Category Skeleton --- */}
      <div className="flex flex-col md:flex-row items-center gap-4 pb-2">
        <Skeleton className="h-10 w-full md:max-w-sm rounded-full" /> {/* Search Input */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Skeleton className="h-10 w-[180px] rounded-full" /> {/* Category Select */}
        </div>
      </div>

      {/* --- Grid Skeleton --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {skeletonCards.map((_, index) => (
          <Card key={index} className="border-none shadow-md flex flex-col bg-card overflow-hidden">
            {/* Image Placeholder */}
            <Skeleton className="aspect-[16/10] w-full rounded-t-xl rounded-b-none" />
            
            <CardHeader className="space-y-2 pb-3">
              {/* Title Placeholder */}
              <Skeleton className="h-6 w-3/4" />
              {/* Description Placeholder (2 lines) */}
              <div className="space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </CardHeader>

            <CardContent className="flex-grow pb-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-[120px]" />
              </div>
            </CardContent>

            <CardFooter className="pt-0 pb-6 px-6">
              <Skeleton className="h-10 w-full rounded-md" /> {/* Button Placeholder */}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}