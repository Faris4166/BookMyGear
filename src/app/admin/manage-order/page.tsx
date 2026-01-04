"use client"
import React, { useState, useEffect } from 'react'
import { useUser } from "@clerk/nextjs"; // ดึงข้อมูล User จาก Clerk
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader2, CheckCircle, RefreshCcw, LayoutDashboard } from "lucide-react"

export default function ManageOrderPage() {
  const { user } = useUser(); // ข้อมูลผู้ใช้ที่ล็อกอิน
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      setOrders(Array.isArray(data) ? data.reverse() : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const handleApprove = async (orderId: string) => {
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, newStatus: 'Approved' })
      })
      if (res.ok) { fetchOrders() }
    } catch (e) { alert("Error") }
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin w-8 h-8 text-primary" />
    </div>
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ส่วนหัว Layout คล้ายฝั่ง User */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif tracking-tight text-foreground">Manage Orders</h1>
          <p className="text-muted-foreground text-sm">
            Welcome back, {user?.firstName || 'Admin'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={fetchOrders} variant="outline" size="sm" className="h-9">
            <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Badge variant="secondary" className="px-3 py-1 text-sm font-medium hover:bg-secondary/80">
            Admin
          </Badge>
        </div>
      </div>

      <hr className="border-border" />

      {/* ตารางจัดการรายการจอง */}
      <Card className="rounded-xl overflow-hidden shadow-sm border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="p-4 font-semibold text-muted-foreground">ผู้จอง</TableHead>
                <TableHead className="p-4 font-semibold text-muted-foreground">อุปกรณ์</TableHead>
                <TableHead className="p-4 font-semibold text-muted-foreground">วันที่ยืม - คืน</TableHead>
                <TableHead className="p-4 font-semibold text-muted-foreground">สถานะ</TableHead>
                <TableHead className="p-4 text-center font-semibold text-muted-foreground">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-10 text-center text-muted-foreground italic">
                    ไม่มีรายการคำขอจองในขณะนี้
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order, index) => (
                  <TableRow key={order.id || index} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="p-4">
                      <p className="font-medium text-foreground">{order.userName || 'ไม่ระบุชื่อ'}</p>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{order.name}</span>
                        <span className="text-xs text-muted-foreground">{order.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-4 text-sm text-foreground">
                      {order.datastart} — {order.dataend}
                    </TableCell>
                    <TableCell className="p-4">
                      <Badge
                        variant={order.status === 'Approved' ? 'secondary' : 'outline'}
                        className={order.status === 'Approved' ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400' : ''}
                      >
                        {order.status === 'Pending' ? 'รอการอนุญาต' : 'ได้รับอนุญาตแล้ว'}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-4 text-center">
                      {order.status === 'Pending' ? (
                        <Button
                          size="sm"
                          onClick={() => handleApprove(order.id)}
                          className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" /> อนุมัติ
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">ดำเนินการแล้ว</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
