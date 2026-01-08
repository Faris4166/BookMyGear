import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background Decoration (เลียนแบบหน้าจริง) */}
      <div className="absolute top-0 -z-10 h-full w-full">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-primary/5 opacity-30 blur-[80px]"></div>
      </div>

      <main className="container z-10 flex flex-col items-center px-6 text-center">
        {/* Badge Skeleton */}
        <Skeleton className="mb-6 h-7 w-64 rounded-full" />

        {/* Title Skeleton */}
        <Skeleton className="h-16 w-full max-w-[400px] mb-4" />
        
        {/* Subtitle Skeleton */}
        <div className="mt-6 space-y-2">
          <Skeleton className="h-4 w-[300px] sm:w-[500px]" />
          <Skeleton className="h-4 w-[250px] sm:w-[400px] mx-auto" />
        </div>

        {/* Buttons Skeleton */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Skeleton className="h-12 w-40 rounded-md" />
          <Skeleton className="h-12 w-40 rounded-md" />
        </div>

        {/* Feature Cards Skeleton */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3 w-full max-w-4xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-4 p-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}