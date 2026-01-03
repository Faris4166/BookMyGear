"use client"
import React, { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function ManageOrderPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // ฟังก์ชันดึงข้อมูลจาก API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders'); 
      if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลได้");
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [])

  // ฟังก์ชันอัปเดตสถานะ (อนุมัติ/ปฏิเสธ)
  const handleUpdateStatus = async (orderId: string, status: string) => {
    if (!orderId) return alert("ไม่พบรหัสรายการ");
    
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, newStatus: status })
      });

      if (res.ok) {
        alert("อัปเดตสถานะสำเร็จ");
        fetchOrders(); // โหลดข้อมูลใหม่หลังจากอัปเดต
      } else {
        alert("อัปเดตล้มเหลว");
      }
    } catch (e) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="mt-2">กำลังโหลดข้อมูล...</p>
    </div>
  )

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Manage Orders</h1>
        <Button onClick={fetchOrders} variant="outline" size="sm">Refresh</Button>
      </div>

      <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-4 font-semibold">อุปกรณ์</th>
              <th className="p-4 font-semibold">วันที่จอง - คืน</th>
              <th className="p-4 font-semibold">สถานะ</th>
              <th className="p-4 font-semibold text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-muted-foreground">ไม่มีรายการจองอุปกรณ์</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id || Math.random()} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <div className="font-medium">{order.name}</div>
                    <div className="text-xs text-muted-foreground">ID: {order.id}</div>
                  </td>
                  <td className="p-4 text-sm">
                    {order.datastart} — {order.dataend}
                  </td>
                  <td className="p-4">
                    <Badge variant={
                      order.status === 'Approved' ? 'secondary' : 
                      order.status === 'Pending' ? 'outline' : 'destructive'
                    }>
                      {order.status === 'Pending' ? 'รอการอนุญาต' : 
                       order.status === 'Approved' ? 'ได้รับอนุญาตแล้ว' : 
                       order.status === 'Rejected' ? 'ปฏิเสธ' : order.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      {order.status === 'Pending' && (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 h-8"
                            onClick={() => handleUpdateStatus(order.id, 'Approved')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" /> อนุมัติ
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            className="h-8"
                            onClick={() => handleUpdateStatus(order.id, 'Rejected')}
                          >
                            <XCircle className="w-4 h-4 mr-1" /> ปฏิเสธ
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}