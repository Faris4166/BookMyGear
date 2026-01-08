"use client"
import React, { useState, useEffect, useCallback, memo, useMemo } from 'react'
import { useUser } from "@clerk/nextjs"; 
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, CheckCircle, XCircle, RefreshCcw, CheckCircle2, AlertCircle, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export default function ManageOrderPage() {
  const { user } = useUser(); 
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  // --- Search, Filter & Pagination States ---
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All") // เพิ่ม State สำหรับกรอง Status
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogStatus, setDialogStatus] = useState<{ title: string, desc: string, type: 'success' | 'error' }>({
    title: "", desc: "", type: 'success'
  })

  const showPopup = useCallback((title: string, desc: string, type: 'success' | 'error') => {
    setDialogStatus({ title, desc, type })
    setDialogOpen(true)
  }, [])

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  // --- Logic การกรองข้อมูล ---
  const categories = useMemo(() => {
    const cats = orders.map(order => order.category)
    return ["All", ...Array.from(new Set(cats.filter(Boolean)))]
  }, [orders])

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        (order.userName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (order.name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === "All" || order.category === selectedCategory
      const matchesStatus = selectedStatus === "All" || order.status === selectedStatus // กรอง Status

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [orders, searchQuery, selectedCategory, selectedStatus])

  // --- Logic Pagination ---
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredOrders, currentPage])

  useEffect(() => { setCurrentPage(1) }, [searchQuery, selectedCategory, selectedStatus])

  const handleUpdateStatus = useCallback(async (orderId: string, newStatus: 'Approved' | 'Rejected') => {
    if (processingIds.has(orderId)) return;
    try {
      setProcessingIds(prev => new Set(prev).add(orderId))
      const res = await fetch('/api/admin/approve', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, newStatus })
      })
      const data = await res.json()
      if (res.ok) {
        fetchOrders()
        showPopup("ดำเนินการสำเร็จ", `รายการได้รับการ ${newStatus === 'Approved' ? 'อนุมัติ' : 'ปฏิเสธ'} แล้ว`, "success")
      } else {
        showPopup("ไม่สามารถดำเนินการได้", data.error || "เกิดข้อผิดพลาด", "error")
      }
    } catch (e) {
      showPopup("เกิดข้อผิดพลาด", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้", "error")
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev); next.delete(orderId); return next
      })
    }
  }, [processingIds, fetchOrders, showPopup])

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin w-8 h-8 text-primary" />
    </div>
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif tracking-tight text-foreground">Manage Orders</h1>
          <p className="text-muted-foreground text-sm">Welcome back, {user?.firstName || 'Admin'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={fetchOrders} variant="outline" size="sm" className="h-9">
            <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">Admin</Badge>
        </div>
      </div>

      <hr className="border-border" />

      {/* --- Search & Filters Section --- */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-full bg-card shadow-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Category Select */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[160px] rounded-full bg-card shadow-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Select (เพิ่มใหม่ตามคำขอ) */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[160px] rounded-full bg-card shadow-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
              {paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-10 text-center text-muted-foreground italic">
                    ไม่มีรายการคำขอจองในขณะนี้
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => (
                  <OrderTableRow
                    key={order.id}
                    order={order}
                    isProcessing={processingIds.has(order.id)}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- Pagination Controls --- */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-2">
          <p className="text-sm text-muted-foreground italic">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length}
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex flex-col items-center gap-2 pt-4">
            {dialogStatus.type === 'success' ? <CheckCircle2 className="h-12 w-12 text-green-500" /> : <AlertCircle className="h-12 w-12 text-destructive" />}
            <DialogTitle className="text-xl text-center">{dialogStatus.title}</DialogTitle>
            <DialogDescription className="text-center">{dialogStatus.desc}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button className="w-full" onClick={() => setDialogOpen(false)}>รับทราบ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const OrderTableRow = memo(({ order, isProcessing, onUpdateStatus }: any) => {
  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="p-4"><p className="font-medium text-foreground">{order.userName || 'ไม่ระบุชื่อ'}</p></TableCell>
      <TableCell className="p-4">
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{order.name}</span>
          <span className="text-xs text-muted-foreground">{order.category}</span>
        </div>
      </TableCell>
      <TableCell className="p-4 text-sm text-foreground">{order.datastart} — {order.dataend}</TableCell>
      <TableCell className="p-4">
        <Badge
          variant={order.status === 'Approved' ? 'secondary' : order.status === 'Rejected' ? 'destructive' : 'outline'}
          className={
            order.status === 'Approved' ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400' :
            order.status === 'Rejected' ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' : ''
          }
        >
          {order.status === 'Pending' ? 'รอการอนุญาต' : order.status === 'Approved' ? 'ได้รับอนุญาตแล้ว' : 'ไม่ได้รับอนุญาต'}
        </Badge>
      </TableCell>
      <TableCell className="p-4 text-center">
        {order.status === 'Pending' ? (
          <div className="flex justify-center gap-2">
            <Button size="sm" onClick={() => onUpdateStatus(order.id, 'Approved')} className="bg-green-600 hover:bg-green-700 text-white shadow-sm" disabled={isProcessing}>
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />} อนุมัติ
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onUpdateStatus(order.id, 'Rejected')} className="shadow-sm" disabled={isProcessing}>
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />} ปฏิเสธ
            </Button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic">ดำเนินการแล้ว</span>
        )}
      </TableCell>
    </TableRow>
  )
});
OrderTableRow.displayName = "OrderTableRow";