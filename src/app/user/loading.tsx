import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-32" /> {/* เลียนแบบคำว่า Home */}
          <Skeleton className="h-4 w-48" /> {/* เลียนแบบชื่อ User */}
        </div>
        <Skeleton className="h-10 w-24 rounded-full" /> {/* เลียนแบบป้าย Role */}
      </div>

      <Separator />

      {/* Grid ของ Card Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="border-none shadow-md flex flex-col">
            {/* ส่วนรูปภาพ */}
            <Skeleton className="aspect-[16/10] w-full rounded-t-xl" />
            
            <CardHeader className="space-y-2 pb-3">
              <Skeleton className="h-6 w-3/4" /> {/* ชื่อสินค้า */}
              <Skeleton className="h-4 w-full" /> {/* คำอธิบายบรรทัด 1 */}
            </CardHeader>

            <CardContent className="flex-grow pb-4">
              <Skeleton className="h-4 w-1/2" /> {/* สถานะ Stock */}
            </CardContent>

            <CardFooter className="pt-0 pb-6 px-6">
              <Skeleton className="h-10 w-full rounded-md" /> {/* ปุ่มกด */}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}