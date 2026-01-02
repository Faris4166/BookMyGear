import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { User } from '../../../../types/user'; // import type ที่เราสร้างไว้
import { item } from '../../../../types/item';
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';

export default function UserHomePage() {
  //ตัวอย่างข้อมูล user
  const currentUser: User = {
    name: 'Faris',
    role: 'Teacher/Student' // ลองเปลี่ยนเป็น 'admin' ดู TypeScript จะฟ้อง error ทันที
  };

  // ตัวอย่างข้อมูล items
  const items: item = {
    name: 'Red Dead Redemption 2',
    img: "/rdr2.jpg",
    stock: 5,
    description: 'Arthur Morgan and the Van der Linde Gang are outlaws on the run. With federal agents and bounty hunters massing on their heels, the gang must rob, steal, and fight their way across the rugged heartland in order to survive.',
    category: 'Game',
  };

  return (
 <div className="container mx-auto p-6 space-y-6">
      {/* ส่วนหัวหน้าเว็บ */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Home</h1>
          <p className="text-muted-foreground text-sm">Welcome back, {currentUser.name}</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
          {currentUser.role}
        </Badge>
      </div>

      <hr className="border-border" />

      {/* Grid ของรายการสินค้า */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
          {/* รูปภาพสินค้าพร้อมควบคุมสัดส่วน */}
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={items.img}
              alt={items.name}
              fill // ใช้ fill เพื่อให้รูปขยายเต็ม div พ่อ
              className="object-cover hover:scale-105 transition-transform duration-300 p-2.5"
            />
          </div>

          <CardHeader className="space-y-1">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl line-clamp-1">{items.name}</CardTitle>
              <Badge variant="outline">{items.stock} Left</Badge>
            </div>
            {/* ปรับให้ truncate ทำงานได้ดีขึ้นด้วย line-clamp-2 */}
            <CardDescription className="line-clamp-2 min-h-[40px]">
              {items.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-grow">
            <Badge variant="secondary">{items.category}</Badge>
          </CardContent>

          <CardFooter className="pt-0">
            <Button asChild className="w-full">
              <Link href="/user/booking">Book Now</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
