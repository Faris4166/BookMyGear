import { Roles } from "./types"; // ถ้ามีไฟล์ types อื่นๆ สามารถ import มาได้

export {}

declare global {
  /**
   * กำหนดโครงสร้างของ Custom JWT Session Claims สำหรับ Clerk
   * เพื่อให้ TypeScript รู้จัก metadata ที่เราตั้งค่าไว้ใน Dashboard
   */
  interface CustomJwtSessionClaims {
    metadata: {
      role?: "admin" | "user";
    };
  }
}