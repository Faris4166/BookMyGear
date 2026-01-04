import { User } from "../../../types/user"; // import type ที่เราสร้างไว้

export default function DashboardPage() {
  // สมมติว่านี่คือข้อมูลที่ได้จาก API หรือ Database
  const currentUser: User = {
    name: 'Somchai',
    role: 'Admin' // ลองเปลี่ยนเป็น 'guest' ดู TypeScript จะฟ้อง error ทันที
  };

  return (
    <div className="p-8">
      <h1>สวัสดีคุณ {currentUser.name}</h1>
      <p>สถานะปัจจุบัน: <strong>{currentUser.role}</strong></p>

      <hr className="my-4" />

      {/* ตัวอย่างการเช็คเงื่อนไขจาก Role */}
      {currentUser.role === 'Admin' ? (
        <div className="bg-red-100 p-4 border-l-4 border-red-500">
          <h2 className="font-bold">Admin Panel</h2>
          <p>คุณสามารถจัดการระบบ ลบยูเซอร์ หรือแก้ไขข้อมูลได้</p>
          <button className="bg-red-500 text-white px-4 py-2 mt-2 rounded">
            ลบข้อมูลทั้งหมด
          </button>
        </div>
      ) : (
        <div className="bg-blue-100 p-4 border-l-4 border-blue-500">
          <h2 className="font-bold">User Member</h2>
          <p>คุณสามารถดูข้อมูลส่วนตัวได้อย่างเดียว</p>
        </div>
      )}
    </div>
  );
}