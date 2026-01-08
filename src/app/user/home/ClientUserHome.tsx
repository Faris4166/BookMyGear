"use client"
import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { Package2, UserCircle, ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function ClientUserHome({ initialItems }: { initialItems: any[] }) {
    const { user } = useUser();
    const [items] = useState<any[]>(initialItems);

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const itemsPerPage = 8;

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300); // 300ms delay

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const categories = useMemo(() => ["All", ...new Set(items.map((item: any) => item.category))], [items]);

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
            const matchesSearch = item.name.toLowerCase().includes(debouncedSearch.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, debouncedSearch, items]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, debouncedSearch]);

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
                    />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2 text-muted-foreground whitespace-nowrap">
                        <Filter className="w-4 h-4" />
                        <span className="text-sm font-medium">Category:</span>
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
                {currentItems.map((product) => (
                    <Card key={product.id} className="group border-none shadow-md hover:shadow-xl transition-all duration-300 flex flex-col bg-card">
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-xl">
                            <Image
                                src={product.img}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
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
                ))}
            </div>

            {/* Pagination */}
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
                    No items found matching your search.
                </div>
            )}
        </div>
    )
}
