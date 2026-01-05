// proxy.ts (หรือ middleware.ts)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. กำหนด Route ที่ต้องป้องกัน
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isUserRoute = createRouteMatcher(['/user(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // 2. ถ้าเข้า Route ของ User หรือ Admin ต้อง Login ก่อนเสมอ
  // (ถ้ายังไม่ Login ระบบ Clerk จะ Redirect ไปหน้า Sign-in อัตโนมัติ)
  if (isUserRoute(req) || isAdminRoute(req)) {
    await auth.protect();
  }

  // 3. กฎพิเศษสำหรับ Admin: ต้องมี role เป็น 'admin' เท่านั้น
  if (isAdminRoute(req)) {
    const { sessionClaims } = await auth();
    
    // ตรวจสอบ Metadata ว่า role เป็น admin หรือไม่
    if (sessionClaims?.metadata?.role !== 'admin') {
      // ถ้าไม่ใช่ admin ให้ดีดกลับไปหน้าแรก
      const url = new URL('/', req.url);
      return Response.redirect(url);
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};