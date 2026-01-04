import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import { item } from '../../../../types/item';
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator"; // แนะนำให้ใช้ Separator จาก UI library
import { auth, currentUser } from "@clerk/nextjs/server";
import { Package2, UserCircle } from "lucide-react"; // เพิ่ม Icon เพื่อความสวยงาม

export default async function UserHomePage() {
  const user = await currentUser();
  const { sessionClaims } = await auth();

  const userRole = (sessionClaims?.metadata?.role as string) || 'Student/Teacher';

  const filePath = path.join(process.cwd(), 'data', 'items.json');
  const fileContent = await fs.readFile(filePath, 'utf8');
  const items: item[] = JSON.parse(fileContent);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Home</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserCircle className="w-4 h-4" />
            <p>Welcome back, <span className="font-medium text-foreground">{user?.firstName}</span></p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-secondary/50 px-4 py-2 rounded-full w-fit">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-semibold uppercase tracking-wider">{userRole}</span>
        </div>
      </div>

      <Separator />

      {/* --- Grid Section --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map((product) => (
          <Card key={product.id} className="group border-none shadow-md hover:shadow-xl transition-all duration-300 flex flex-col bg-card">
            {/* Image Container */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-xl">
              <Image 
                src={product.img} 
                alt={product.name} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute top-2 right-2">
                <Badge className="backdrop-blur-md bg-white/70 text-black border-none">
                  {product.category}
                </Badge>
              </div>
            </div>

            <CardHeader className="space-y-2 pb-3">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg font-bold leading-tight line-clamp-1">
                  {product.name}
                </CardTitle>
              </div>
              <CardDescription className="line-clamp-2 text-sm leading-relaxed min-h-[40px]">
                {product.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-grow pb-4">
               <div className="flex items-center gap-2 text-sm">
                  <Package2 className="w-4 h-4 text-muted-foreground" />
                  <span className={product.stock > 0 ? "text-foreground" : "text-destructive font-medium"}>
                    {product.stock > 0 ? `${product.stock} items available` : "Out of stock"}
                  </span>
               </div>
            </CardContent>

            <CardFooter className="pt-0 pb-6 px-6">
              <Button 
                asChild={product.stock > 0} 
                className={`w-full font-semibold transition-all ${product.stock > 0 ? "shadow-sm" : ""}`}
                variant={product.stock > 0 ? "default" : "secondary"}
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? (
                  <Link href={`/user/home/${product.id}`}>Book This Item</Link>
                ) : (
                  <span>Currently Unavailable</span>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}