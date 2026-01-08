"use client"
import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Package2, UserCircle, ChevronLeft, ChevronRight, Filter, Search } from "lucide-react"; // เพิ่ม Search Icon
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input"; // นำเข้า Input
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// --- Component สำหรับแสดงผลตอนโหลด (Skeleton Card) ---
function ItemSkeleton() {
  return (
    <Card className="border-none shadow-md flex flex-col bg-card">
      <Skeleton className="aspect-[16/10] w-full rounded-t-xl" />
      <CardHeader className="space-y-2 pb-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardHeader>
      <CardContent className="flex-grow pb-4">
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="pt-0 pb-6 px-6">
        <Skeleton className="h-10 w-full rounded-md" />
      </CardFooter>
    </Card>
  )
}

export default function UserHomePage() {
  const { user } = useUser();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState(""); // 1. เพิ่ม State สำหรับการค้นหา
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/items');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch items");
        setItems(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('User Home fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = useMemo(() => ["All", ...new Set(items.map((item: any) => item.category))], [items]);

  // 2. ปรับ Logic การ Filter ให้รวม Search Query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, items]);

  // Reset หน้าไปที่ 1 เมื่อมีการค้นหาหรือเปลี่ยนหมวดหมู่
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
      {/* Header Section */}
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

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment name..."
            className="pl-10 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 text-muted-foreground whitespace-nowrap">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Category:</span>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isLoading}>
            <SelectTrigger className="w-[180px] rounded-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* --- Grid Section --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {isLoading ? (
          Array.from({ length: itemsPerPage }).map((_, index) => (
            <ItemSkeleton key={index} />
          ))
        ) : (
          currentItems.map((product) => (
            <Card key={product.id} className="group border-none shadow-md hover:shadow-xl transition-all duration-300 flex flex-col bg-card">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-xl">
                <Image
                  src={product.img}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  priority={indexOfFirstItem + currentItems.indexOf(product) < 4}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="backdrop-blur-md bg-white/70 text-black border-none">
                    {product.category}
                  </Badge>
                </div>
              </div>

              <CardHeader className="space-y-2 pb-3">
                <Link href={`/user/home/${product.id}`}>
                  <CardTitle className="text-lg font-bold leading-tight line-clamp-1">{product.name}</CardTitle>
                </Link>
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
          ))
        )}
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
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

      {!isLoading && filteredItems.length === 0 && (
        <div className="text-center py-20 text-muted-foreground italic">
          No items found matching your search.
        </div>
      )}
    </div>
  )
}