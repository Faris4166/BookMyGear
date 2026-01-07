// types/item.ts
export type Item = {
    id: string; // หรือ number ขึ้นอยู่กับที่คุณตั้งใน Supabase แต่ส่วนใหญ่เป็น string (uuid)
    name: string;
    img: string;
    stock: number;
    description: string;
    category: string;
    role: string; // เพิ่มตามรีเควส
    created_at?: string; // Optional: รับค่าวันที่สร้างจาก DB
};