"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { format, addDays } from "date-fns"
import { CalendarIcon, Loader2, ArrowLeft } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
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

  const handleBooking = async () => {
    if (!date?.from || !date?.to) return alert("กรุณาเลือกวันที่")
    if (product.stock <= 0) return alert("สินค้าหมดสต็อก")

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
        alert("ส่งคำขอจองแล้ว รอการอนุญาต")
        router.push('/user/history')
      }
    } catch (error) { alert("เกิดข้อผิดพลาด") } finally { setIsBooking(false) }
  }

  if (isLoading) return <div className="p-10 text-center">Loading...</div>

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <Image src={product.img} alt={product.name} width={500} height={300} className="rounded-xl border" />
          <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
          <Badge variant="outline" className="mt-2">คงเหลือ: {product.stock} ชิ้น</Badge>
          <p className="text-muted-foreground mt-4">{product.description}</p>
        </div>
        <div className="bg-card border rounded-2xl p-6 shadow-sm h-fit space-y-6">
          <h2 className="text-xl font-semibold">จองอุปกรณ์</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start h-12">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (date.to ? `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}` : format(date.from, "dd/MM/yyyy")) : "เลือกวันที่"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0"><Calendar mode="range" selected={date} onSelect={setDate} disabled={(d) => d < new Date()} /></PopoverContent>
          </Popover>
          <Button onClick={handleBooking} className="w-full h-12" disabled={isBooking || product.stock <= 0}>
            {product.stock <= 0 ? "สินค้าหมด" : isBooking ? "กำลังส่ง..." : "ขอยืมอุปกรณ์"}
          </Button>
        </div>
      </div>
    </div>
  )
}