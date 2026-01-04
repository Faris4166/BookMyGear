"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { format, addDays } from "date-fns"
import { CalendarIcon, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  
  // State สำหรับ Popup
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogStatus, setDialogStatus] = useState<{title: string, desc: string, type: 'success' | 'error'}>({
    title: "", desc: "", type: 'success'
  })

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3),
  })

  useEffect(() => {
    const loadData = async () => {
      const { id } = await params
      const response = await fetch('/api/items')
      const items = await response.json()
      setProduct(items.find((i: any) => i.id === id))
      setIsLoading(false)
    }
    loadData()
  }, [params])

  const showPopup = (title: string, desc: string, type: 'success' | 'error') => {
    setDialogStatus({ title, desc, type })
    setDialogOpen(true)
  }

  const handleBooking = async () => {
    if (!date?.from || !date?.to) return showPopup("กรุณาเลือกวันที่", "โปรดระบุช่วงเวลาที่ต้องการยืมอุปกรณ์", "error")
    if (product.stock <= 0) return showPopup("สินค้าหมด", "ขออภัย อุปกรณ์ชิ้นนี้ไม่พร้อมใช้งานในขณะนี้", "error")

    setIsBooking(true)
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: product.id,
          name: product.name,
          img: product.img,
          description: product.description,
          category: product.category,
          datastart: format(date.from, 'yyyy-MM-dd'),
          dataend: format(date.to, 'yyyy-MM-dd'),
        }),
      })
      if (response.ok) {
        showPopup("ส่งคำขอจองสำเร็จ", "ระบบได้รับคำขอของคุณแล้ว กำลังรอการตรวจสอบ", "success")
      }
    } catch (error) { 
      showPopup("เกิดข้อผิดพลาด", "ไม่สามารถส่งคำขอได้ในขณะนี้", "error") 
    } finally { 
      setIsBooking(false) 
    }
  }

  // --- ส่วน Skeleton ขณะโหลด ---
  if (isLoading) return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6">
      <Skeleton className="h-10 w-24" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton className="h-[350px] w-full rounded-2xl" />
      </div>
    </div>
  )

  return (
    <div className="container mx-auto p-6 max-w-5xl animate-in fade-in duration-500">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 hover:bg-secondary">
        <ArrowLeft className="mr-2 h-4 w-4" /> กลับหน้าหลัก
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Side: Product Info */}
        <div className="space-y-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border bg-muted shadow-sm">
            <Image 
              src={product.img} 
              alt={product.name} 
              fill 
              className="object-cover transition-transform hover:scale-105 duration-300" 
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
            <Badge variant={product.stock > 0 ? "secondary" : "destructive"} className="mt-3 text-sm px-3 py-1">
              คงเหลือ: {product.stock} ชิ้น
            </Badge>
            <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-dashed">
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Booking Card */}
        <div className="bg-card border rounded-3xl p-8 shadow-lg h-fit space-y-8 sticky top-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-bold">ระบุระยะเวลาการยืม</h2>
            <p className="text-sm text-muted-foreground">เลือกช่วงวันที่ต้องการใช้งานอุปกรณ์</p>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">ช่วงวันที่</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start h-14 text-base border-2 hover:border-primary transition-all">
                  <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                  {date?.from ? (
                    date.to ? `${format(date.from, "dd MMM yyyy")} - ${format(date.to, "dd MMM yyyy")}` : format(date.from, "dd MMM yyyy")
                  ) : "กรุณาเลือกวันที่"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar 
                  mode="range" 
                  selected={date} 
                  onSelect={setDate} 
                  disabled={(d) => d < new Date()} 
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button 
            onClick={handleBooking} 
            className="w-full h-14 text-lg font-bold shadow-md active:scale-[0.98] transition-transform" 
            disabled={isBooking || product.stock <= 0}
          >
            {isBooking ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> กำลังประมวลผล...</>
            ) : product.stock <= 0 ? (
              "สินค้าหมดชั่วคราว"
            ) : (
              "ยืนยันการขอยืมอุปกรณ์"
            )}
          </Button>
        </div>
      </div>

      {/* --- Shadcn UI Dialog (แทนที่ Window Alert) --- */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex flex-col items-center gap-2 pt-4">
            {dialogStatus.type === 'success' ? (
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            ) : (
              <AlertCircle className="h-12 w-12 text-destructive" />
            )}
            <DialogTitle className="text-xl text-center">{dialogStatus.title}</DialogTitle>
            <DialogDescription className="text-center">{dialogStatus.desc}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button 
              className="w-full" 
              onClick={() => {
                setDialogOpen(false)
                if (dialogStatus.type === 'success') router.push('/user/history')
              }}
            >
              รับทราบ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}