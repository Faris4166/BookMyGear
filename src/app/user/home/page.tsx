import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { promises as fs } from 'fs'; // เพิ่มการนำเข้า fs
import path from 'path'; // เพิ่มการนำเข้า path
import { User } from '../../../../types/user';
import { item } from '../../../../types/item';
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';

export default async function UserHomePage() { // เปลี่ยนเป็น async function
  const currentUser: User = {
    name: 'Faris',
    role: 'Teacher/Student'
  };

  // ดึงข้อมูลจากไฟล์ JSON
  const filePath = path.join(process.cwd(), 'data', 'items.json');
  const fileContent = await fs.readFile(filePath, 'utf8');
  const items: item[] = JSON.parse(fileContent);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ส่วนหัวคงเดิม */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif tracking-tight">Home</h1>
          <p className="text-muted-foreground text-sm">Welcome back, {currentUser.name}</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
          {currentUser.role}
        </Badge>
      </div>

      <hr className="border-border" />

      {/* Grid ของรายการสินค้าที่ดึงมาจาก JSON */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((product) => (
          <Card key={product.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
            {/* รายละเอียด Card คงเดิม */}
            <div className="relative aspect-video w-full overflow-hidden">
              <Image src={product.img} alt={product.name} fill className="object-cover hover:scale-105 transition-transform duration-300 p-2.5" />
            </div>
            <CardHeader className="space-y-1">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl line-clamp-1">{product.name}</CardTitle>
                <Badge variant={product.stock > 0 ? "outline" : "destructive"}>
                  {product.stock > 0 ? `${product.stock} Stock` : "Out of Stock"}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2 min-h-[40px]">{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <Badge variant="secondary">{product.category}</Badge>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild={product.stock > 0} className="w-full" disabled={product.stock <= 0}>
                {product.stock > 0 ? <Link href={`/user/home/${product.id}`}>Book Now</Link> : <span>Unavailable</span>}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}