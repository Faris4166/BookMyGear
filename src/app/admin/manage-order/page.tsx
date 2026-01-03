"use client"
import React, { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, RefreshCcw } from "lucide-react"

export default function ManageOrderPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      setOrders(Array.isArray(data) ? data.reverse() : [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
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

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div>

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
      <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4">ผู้จอง</th>
              <th className="p-4">อุปกรณ์</th>
              <th className="p-4">สถานะ</th>
              <th className="p-4 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order, index) => (
              <tr key={order.id || index}>
                <td className="p-4 font-medium">{order.userName}</td>
                <td className="p-4">{order.name}</td>
                <td className="p-4"><Badge variant={order.status === 'Approved' ? 'secondary' : 'outline'}>{order.status}</Badge></td>
                <td className="p-4 text-center">
                  {order.status === 'Pending' && (
                    <Button size="sm" onClick={() => handleApprove(order.id)} className="bg-green-600">อนุมัติ</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}