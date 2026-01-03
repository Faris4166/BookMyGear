import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { User } from '../../../../types/user'; 
import { item } from '../../../../types/item';
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';

export default function UserHomePage() {
  const currentUser: User = {
    name: 'Faris',
    role: 'Teacher/Student'
  };

  // ข้อมูล items เป็น Array
  const items: item[] = [
    {
      id: '1',
      name: 'Red Dead Redemption 2',
      img: "/rdr2.jpg",
      stock: 5,
      description: 'Arthur Morgan and the Van der Linde Gang are outlaws on the run...',
      category: 'Game',
    },
    {
      id: '2',
      name: 'SONY PlayStation 5 (PS5)',
      img: "/PS5.jpg",
      stock: 3,
      description: 'The PlayStation 5 (PS5) is a home video game console...',
      category: 'Console',
    },
    {
      id: '3',
      name: 'Football',
      img: "/football.jpg",
      stock: 0,
      description: 'A football is a ball inflated with air...',
      category: 'Sport',
    },
    {
      id: '4',
      name: 'Macbook Pro',
      img: "/Macbook-Pro.png",
      stock: 1,
      description: 'The MacBook Pro is a line of Macintosh portable computers...',
      category: 'Laptop',
    },

  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
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
        {/* ใช้ .map() เพื่อวนลูปแสดง Card ตามจำนวน items */}
        {items.map((product) => (
          <Card key={product.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={product.img}
                alt={product.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300 p-2.5"
              />
            </div>

            <CardHeader className="space-y-1">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl line-clamp-1">{product.name}</CardTitle>
                {/* ปรับสี Badge ตามสถานะ stock */}
                <Badge variant={product.stock > 0 ? "outline" : "destructive"}>
                   {product.stock > 0 ? `${product.stock} Stock` : "Out of Stock"}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2 min-h-[40px]">
                {product.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-grow">
              <Badge variant="secondary">{product.category}</Badge>
            </CardContent>

            <CardFooter className="pt-0">
              {/* ตรวจสอบเงื่อนไข disabled ถ้า stock เป็น 0 */}
              <Button
                asChild={product.stock > 0} 
                className="w-full"
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? (
                  <Link href={`/user/booking/${product.id}`}>Book Now</Link>
                ) : (
                  <span>Unavailable</span>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}