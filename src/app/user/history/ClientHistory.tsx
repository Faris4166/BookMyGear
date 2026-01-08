"use client"

import React, { useState, useMemo } from 'react'
import Image from 'next/image';
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
    ArrowRight,
    CalendarArrowDown,
    CalendarArrowUp,
    Info,
    Search,
    Filter
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ClientHistory({ initialOrders }: { initialOrders: any[] }) {
    const [orders] = useState<any[]>(initialOrders);

    // State สำหรับ Search และ Filter
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Logic สำหรับการค้นหาและกรองข้อมูล
    const filteredOrders = useMemo(() => {
        return orders.filter((item) => {
            const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || item.status?.toLowerCase() === statusFilter.toLowerCase();
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter, orders]);

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight">History</h1>
                <p className="text-muted-foreground text-sm">ตรวจสอบและค้นหาประวัติการทำรายการของคุณ</p>
            </div>

            {/* Search & Filter Section */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="ค้นหาชื่ออุปกรณ์..."
                        className="pl-10 rounded-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[180px] rounded-lg">
                            <SelectValue placeholder="สถานะทั้งหมด" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">สถานะทั้งหมด</SelectItem>
                            <SelectItem value="pending">รอการอนุญาต</SelectItem>
                            <SelectItem value="approved">ได้รับอนุญาตแล้ว</SelectItem>
                            <SelectItem value="rejected">ไม่ได้รับอนุญาต</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Content Section */}
            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/30">
                        <p className="text-muted-foreground">ไม่พบประวัติการทำรายการที่คุณค้นหา</p>
                    </div>
                ) : (
                    <Accordion type="single" collapsible className="w-full space-y-3">
                        {filteredOrders.map((item: any, index: number) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border rounded-xl px-4 bg-card shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <AccordionTrigger className="py-6 hover:no-underline">
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="w-14 h-14 rounded-lg bg-secondary overflow-hidden flex-shrink-0 relative">
                                            <Image
                                                src={item.img}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                                sizes="56px"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg mb-1 leading-tight">{item.name}</p>
                                            <Badge
                                                variant={
                                                    item.status === 'approved' ? 'secondary' :
                                                        item.status === 'rejected' ? 'destructive' :
                                                            'outline'
                                                }
                                                className="font-medium"
                                            >
                                                {
                                                    item.status === 'pending' ? 'รอการอนุญาต' :
                                                        item.status === 'approved' ? 'ได้รับอนุญาตแล้ว' :
                                                            item.status === 'rejected' ? 'ไม่ได้รับอนุญาต' :
                                                                item.status
                                                }
                                            </Badge>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-6 pt-2 border-t mt-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-semibold flex items-center gap-2 mb-1">
                                                    <Info className="w-4 h-4" /> Description
                                                </h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {item.description || "ไม่มีคำอธิบายอุปกรณ์"}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-muted rounded-lg border">
                                                <p className="italic text-sm text-primary font-medium">
                                                    หมายเหตุ: {item.role}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-secondary/20 p-4 rounded-2xl border border-dashed flex items-center justify-around">
                                            <div className="text-center">
                                                <CalendarArrowDown className="mx-auto mb-2 text-primary w-5 h-5" />
                                                <p className="text-[10px] uppercase text-muted-foreground font-extrabold tracking-wider">Start Date</p>
                                                <p className="font-bold text-sm">{item.datastart}</p>
                                            </div>
                                            <ArrowRight className="text-muted-foreground/30 w-5 h-5" />
                                            <div className="text-center">
                                                <CalendarArrowUp className="mx-auto mb-2 text-primary w-5 h-5" />
                                                <p className="text-[10px] uppercase text-muted-foreground font-extrabold tracking-wider">Return Date</p>
                                                <p className="font-bold text-sm">{item.dataend}</p>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </div>
        </div>
    )
}
