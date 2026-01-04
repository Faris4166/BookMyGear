import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* --- Header Skeleton --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[280px] rounded-lg" />
          <Skeleton className="h-4 w-[180px] rounded-md" />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-10 w-[100px] rounded-xl" />
          <Skeleton className="h-10 w-[140px] rounded-xl" />
          <Skeleton className="h-7 w-[90px] rounded-full" />
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* --- Table/Content Skeleton --- */}
      <div className="border rounded-3xl overflow-hidden bg-white shadow-sm border-slate-200">
        <div className="p-0">
          {/* ส่วนหัวตารางจำลอง */}
          <div className="bg-slate-50/80 p-5 border-b flex justify-between">
             <Skeleton className="h-5 w-[30%] shadow-sm" />
             <Skeleton className="h-5 w-[15%] shadow-sm" />
             <Skeleton className="h-5 w-[10%] shadow-sm" />
             <Skeleton className="h-5 w-[10%] shadow-sm" />
          </div>

          {/* แถวข้อมูลจำลอง 5 แถว */}
          <div className="divide-y divide-slate-100 p-5 space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-4 flex-1">
                  <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-[60%]" />
                    <Skeleton className="h-3 w-[40%]" />
                  </div>
                </div>
                <div className="flex-1 flex justify-center">
                   <Skeleton className="h-6 w-20 rounded-lg" />
                </div>
                <div className="flex-1 flex justify-center">
                   <Skeleton className="h-6 w-10" />
                </div>
                <div className="flex-1 flex justify-end">
                   <Skeleton className="h-9 w-24 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}