"use client"
import React, { useState, useEffect } from 'react'
import { useUser } from "@clerk/nextjs"; // ดึงข้อมูล User จาก Clerk
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
          <h1 className="text-3xl font-serif tracking-tight">Manage Orders</h1>
          <p className="text-muted-foreground text-sm">
            Welcome back, {user?.firstName || 'Admin'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={fetchOrders} variant="outline" size="sm" className="h-9">
            <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800">
            Admin
          </Badge>
        </div>
      </div>

      <hr className="border-border" />

      {/* ตารางจัดการรายการจอง */}
      <div className="border rounded-xl overflow-hidden bg-white shadow-sm border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b text-sm font-semibold text-slate-600">
              <tr>
                <th className="p-4">ผู้จอง</th>
                <th className="p-4">อุปกรณ์</th>
                <th className="p-4">วันที่ยืม - คืน</th>
                <th className="p-4">สถานะ</th>
                <th className="p-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-muted-foreground italic">
                    ไม่มีรายการคำขอจองในขณะนี้
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr key={order.id || index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-slate-900">{order.userName || 'ไม่ระบุชื่อ'}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{order.name}</span>
                        <span className="text-xs text-slate-400">{order.category}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {order.datastart} — {order.dataend}
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={order.status === 'Approved' ? 'secondary' : 'outline'}
                        className={order.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' : ''}
                      >
                        {order.status === 'Pending' ? 'รอการอนุญาต' : 'ได้รับอนุญาตแล้ว'}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      {order.status === 'Pending' ? (
                        <Button 
                          size="sm" 
                          onClick={() => handleApprove(order.id)} 
                          className="bg-green-600 hover:bg-green-700 shadow-sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" /> อนุมัติ
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">ดำเนินการแล้ว</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}