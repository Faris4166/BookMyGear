import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// กำหนดว่าหน้าไหนต้องเป็น Admin เท่านั้น
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role !== 'admin') {
      // ถ้าไม่ใช่ admin ให้ส่งกลับหน้าแรก
      const url = new URL('/', req.url);
      return Response.redirect(url);
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};