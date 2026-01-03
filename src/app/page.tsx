import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-primary">
        Equipment Booking System
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        ระบบยืม-คืนอุปกรณ์อัจฉริยะ จัดการง่าย สะดวก และรวดเร็ว
      </p>

      {/* ถ้ายังไม่ได้ Login */}
      <SignedOut>
        <div className="flex gap-4">
          <SignInButton mode="modal">
            <Button size="lg" className="px-8 font-semibold">
              ลงชื่อเข้าใช้งาน
            </Button>
          </SignInButton>
        </div>
      </SignedOut>

      {/* ถ้า Login แล้ว */}
      <SignedIn>
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border">
            <UserButton afterSignOutUrl="/" />
            <div className="text-left">
              <p className="text-sm font-medium">เข้าสู่ระบบสำเร็จ</p>
              <p className="text-xs text-muted-foreground">ยินดีต้อนรับกลับมาครับ</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button asChild variant="default" size="lg">
              <Link href="/user/home">ไปที่หน้ายืมอุปกรณ์</Link>
            </Button>
            {/* ปุ่มนี้จะโชว์ให้ Admin (เราจะเช็ค Role ในขั้นตอนถัดไป) */}
            <Button asChild variant="outline" size="lg">
              <Link href="/admin/manage-order">จัดการระบบ (Admin)</Link>
            </Button>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}