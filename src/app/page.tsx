import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server"; 
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Package, ShieldCheck, Zap } from "lucide-react";
// นำเข้า Motion Component (สร้าง Client Wrapper หรือใช้ "use client" แยกส่วน)
import { FadeIn } from "@/components/animations/fade-in"; 

export default async function LandingPage() { 
  
  // ดึงข้อมูล User ปัจจุบันเพื่อเช็ค Role
  const user = await currentUser();
  // เช็คว่า metadata มี role เป็น 'admin' หรือไม่
  const isAdmin = user?.publicMetadata?.role === 'admin';

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background Decoration พร้อม Animate Pulse เบาๆ */}
      <div className="absolute top-0 -z-10 h-full w-full">
        <div className="animate-pulse absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-primary/10 opacity-50 blur-[80px]"></div>
      </div>

      <main className="container z-10 flex flex-col items-center px-6 text-center">
        
        {/* Badge - เลื่อนขึ้นพร้อม Delay */}
        <FadeIn delay={0.1}>
          <div className="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium">
            <span className="text-primary">New</span>
            <span className="mx-2 h-4 w-[1px] bg-border"></span>
            <span>เวอร์ชัน 1.2.4 เปิดใช้งานแล้ววันนี้</span>
          </div>
        </FadeIn>

        {/* Title - ใช้ Gradient Text Animation */}
        <FadeIn delay={0.2}>
          <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-foreground to-primary/70 animate-gradient">
            BookMyGear
          </h1>
        </FadeIn>
        
        <FadeIn delay={0.3}>
          <p className="mt-6 max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            ระบบยืม-คืนอุปกรณ์อัจฉริยะ จัดการง่าย สะดวก และรวดเร็ว 
            ช่วยให้การบริหารจัดการทรัพยากรในองค์กรของคุณเป็นเรื่องง่าย
          </p>
        </FadeIn>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {/* กรณีไม่ได้ Login */}
          <SignedOut>
            <FadeIn delay={0.4}>
              <div className="flex flex-wrap justify-center gap-4">
                <SignInButton mode="modal">
                  <Button size="lg" className="h-12 px-8 text-base font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                    เริ่มต้นใช้งานฟรี <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </SignInButton>
                <Button variant="outline" size="lg" className="h-12 px-8 text-base hover:bg-muted/80">
                  ดูคู่มือการใช้งาน
                </Button>
              </div>
            </FadeIn>
          </SignedOut>

          {/* กรณี Login แล้ว */}
          <SignedIn>
            <FadeIn delay={0.4}>
              <div className="flex flex-col items-center gap-8">
                <div className="flex items-center gap-4 rounded-full border bg-card p-2 pr-6 shadow-sm hover:shadow-md transition-shadow">
                  <UserButton afterSignOutUrl="/" />
                  <div className="text-left">
                    <p className="text-sm font-semibold">ยินดีต้อนรับกลับมา</p>
                    <p className="text-xs text-muted-foreground">พร้อมจัดการอุปกรณ์ของคุณแล้ว</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild size="lg" className="h-12 px-8 hover:scale-105 transition-transform">
                    <Link href="/user/home">ไปที่หน้ายืมอุปกรณ์</Link>
                  </Button>

                  {/* แสดงปุ่ม Admin เฉพาะเมื่อ isAdmin เป็น true */}
                  {isAdmin && (
                    <Button asChild variant="outline" size="lg" className="h-12 px-8 border-primary/50 text-primary hover:bg-primary/5 transition-all">
                      <Link href="/admin/manage-order">จัดการระบบ (Admin)</Link>
                    </Button>
                  )}
                </div>
              </div>
            </FadeIn>
          </SignedIn>
        </div>

        {/* Features - Staggered Fade In */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <FadeIn delay={0.5}>
            <FeatureCard 
              icon={<Zap className="h-6 w-6 text-primary animate-pulse" />}
              title="รวดเร็ว"
              description="จองอุปกรณ์ได้ในไม่กี่คลิก"
            />
          </FadeIn>
          <FadeIn delay={0.6}>
            <FeatureCard 
              icon={<Package className="h-6 w-6 text-primary" />}
              title="ครบถ้วน"
              description="เช็คสถานะอุปกรณ์ได้ Real-time"
            />
          </FadeIn>
          <FadeIn delay={0.7}>
            <FeatureCard 
              icon={<ShieldCheck className="h-6 w-6 text-primary" />}
              title="ปลอดภัย"
              description="ระบบยืนยันตัวตนที่เชื่อถือได้"
            />
          </FadeIn>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group flex flex-col items-center gap-2 p-4 transition-all hover:translate-y-[-4px]">
      <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">{icon}</div>
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}