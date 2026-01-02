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
    <div className="flex flex-col p-4 gap-2.5">
      {/* หัวเรื่องต้อนรับ */}
      <div className='flex flex-row'>
        <h1 className="text-2xl font-serif">
          Hello <span className='underline decoration-sky-500'>{currentUser.name} </span>
          <Badge variant="destructive">{currentUser.role}</Badge>
        </h1>
      </div>
      <hr />
      {/* เนื้อหาหลักของหน้า */}
      <div className='grid sm:grid-cols-1 xl:grid-cols-4 xl:grid-rows-1 sm:grid-rows-1 gap-4'>
        {/* รูปภาพสินค้า */}
        <Card>
          <Image
            src={items.img}
            alt={items.name}
            width={1920}
            height={1080}
            className="rounded-md p-2.5"
          />
          {/* เนื้อหารายการสินค้า */}
          <CardHeader>
            {/* ชื่อสินค้า */}
            <CardTitle>{items.name}</CardTitle>
            {/* คำอธิบายสินค้า */}
            <CardDescription className='truncate'>{items.description}</CardDescription>
            {/* จำนวนสินค้าในสต็อก */}
            <CardAction>
              <Badge>
                {items.stock} in Stock
              </Badge>
            </CardAction>
          </CardHeader>
          {/* หมวดหมู่สินค้า */}
          <CardContent className='flex flex-row justify-start items-start gap-4'>
            <Badge variant="outline">
              {items.category}
            </Badge>
          </CardContent>
          {/* ปุ่มจองอุปกรรณ์ */}
          <CardFooter>
            <Button className='w-full'>
              <Link href="/user/booking">
                Book Now
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
