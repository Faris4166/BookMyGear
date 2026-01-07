"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { Package2, UserCircle, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function UserHomePage() {
  const { user } = useUser();
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const itemsPerPage = 8; // จำนวนสินค้าต่อหน้า

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching items for User Home...');
        const res = await fetch('/api/items');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch items");
        }

        console.log('User Home items received:', data);
        setItems(Array.isArray(data) ? data : []);
        setFilteredItems(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('User Home fetch error:', err);
      }
    };
    fetchData();
  }, []);

  // ระบบแบ่งหมวดหมู่ (Category Filter)
  const categories = ["All", ...new Set(items.map((item: any) => item.category))];

  useEffect(() => {
    let result = items;
    if (selectedCategory !== "All") {
      result = items.filter((item) => item.category === selectedCategory);
    }
    setFilteredItems(result);
    setCurrentPage(1); // รีเซ็ตไปหน้าแรกเมื่อเปลี่ยนหมวดหมู่
  }, [selectedCategory, items]);

  // ระบบแบ่งหน้า (Pagination Logic)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">Equipment Home</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserCircle className="w-4 h-4" />
            <p>Welcome back, <span className="font-medium text-foreground">{user?.firstName}</span></p>
          </div>
        </div>
      </div>

      <Separator />

      {/* --- Category Filter Section --- */}
      <div className="flex flex-wrap items-center gap-2 pb-2 overflow-x-auto">
        <div className="flex items-center gap-2 mr-2 text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            className="rounded-full px-5"
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* --- Grid Section --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {currentItems.map((product) => (
          <Card key={product.id} className="group border-none shadow-md hover:shadow-xl transition-all duration-300 flex flex-col bg-card">
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
              <CardTitle className="text-lg font-bold leading-tight line-clamp-1">{product.name}</CardTitle>
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
                className="w-full font-semibold"
                variant={product.stock > 0 ? "default" : "secondary"}
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? (
                  <Link href={`/user/home/${product.id}`}>Book This Item</Link>
                ) : (
                  <span>Unavailable</span>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* --- Pagination Controls --- */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="text-center py-20 text-muted-foreground italic">
          No items found in this category.
        </div>
      )}
    </div>
  )
}