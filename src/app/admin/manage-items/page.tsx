"use client"
import React, { useState, useEffect, useCallback, memo, useMemo } from 'react'
import { useUser } from "@clerk/nextjs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Loader2, Plus, Edit2, RefreshCcw, ImagePlus, Package2, Tag, 
  Hash, FileText, Trash2, CheckCircle2, AlertCircle, Search, Filter,
  ChevronLeft, ChevronRight 
} from "lucide-react"
import Image from 'next/image'

export default function ManageItemsPage() {
  const { user } = useUser();
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")

  // --- Search & Filter States ---
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // State สำหรับ Popup แจ้งเตือนทั่วไป
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogStatus, setDialogStatus] = useState<{ title: string, desc: string, type: 'success' | 'error' }>({
    title: "", desc: "", type: 'success'
  })

  // State สำหรับการยืนยันการลบ
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string, name: string } | null>(null)

  const showPopup = useCallback((title: string, desc: string, type: 'success' | 'error') => {
    setDialogStatus({ title, desc, type })
    setDialogOpen(true)
  }, [])

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/items')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to fetch items")
      setItems(Array.isArray(data) ? data : [])
    } catch (e: any) {
      showPopup("โหลดข้อมูลไม่สำเร็จ", e.message || "ไม่สามารถดึงข้อมูลสินค้าได้", "error")
    } finally {
      setLoading(false)
    }
  }, [showPopup])

  useEffect(() => { fetchItems() }, [fetchItems])

  // --- Logic การกรองข้อมูล ---
  const categories = useMemo(() => {
    const cats = items.map(item => item.category)
    return ["All", ...Array.from(new Set(cats))]
  }, [items])

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [items, searchQuery, selectedCategory])

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredItems.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredItems, currentPage])

  // รีเซ็ตหน้าเมื่อมีการค้นหา
  useEffect(() => { setCurrentPage(1) }, [searchQuery, selectedCategory])

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const itemData = Object.fromEntries(formData.entries())
    const finalImageUrl = previewUrl || editingItem?.img || "/upload/placeholder.jpg"

    const body = {
      ...itemData,
      stock: Number(itemData.stock),
      img: finalImageUrl,
      id: editingItem?.id
    }

    try {
      const res = await fetch('/api/items', {
        method: editingItem ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (res.ok) {
        setIsDialogOpen(false)
        setEditingItem(null)
        setPreviewUrl("")
        showPopup("บันทึกสำเร็จ", `บันทึกรายการ "${itemData.name}" เรียบร้อยแล้ว`, "success")
        fetchItems()
      } else {
        const err = await res.json();
        showPopup("บันทึกไม่สำเร็จ", err.error || "ไม่สามารถบันทึกข้อมูลได้", "error")
      }
    } catch (e) {
      showPopup("เกิดข้อผิดพลาด", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ในการบันทึก", "error")
    }
  }, [editingItem, previewUrl, showPopup, fetchItems])

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const MAX_SIZE = 3 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert("ไฟล์มีขนาดใหญ่เกินไป (จำกัดไม่เกิน 3MB)");
      return
    }
    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")
      setPreviewUrl(data.url)
    } catch (e: any) {
      showPopup("อัปโหลดไม่สำเร็จ", e.message || "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ", "error")
    } finally {
      setIsUploading(false)
    }
  }, [showPopup])

  const handleDelete = useCallback(async () => {
    if (!itemToDelete) return
    try {
      const res = await fetch(`/api/items?id=${itemToDelete.id}`, { method: 'DELETE' })
      if (res.ok) {
        showPopup("ลบสำเร็จ", `ลบรายการ "${itemToDelete.name}" ออกจากระบบแล้ว`, "success")
        fetchItems()
      } else {
        const data = await res.json()
        showPopup("ลบไม่สำเร็จ", data.error || "เกิดข้อผิดพลาดในการลบ", "error")
      }
    } catch (e) {
      showPopup("เกิดข้อผิดพลาด", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ในการลบ", "error")
    } finally {
      setDeleteConfirmOpen(false)
      setItemToDelete(null)
    }
  }, [itemToDelete, showPopup, fetchItems])

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin w-8 h-8 text-primary" />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-foreground">Manage Items</h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            Welcome back, <span className="font-semibold text-foreground">{user?.firstName || 'Admin'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={fetchItems} variant="outline" size="sm" className="h-10 px-4">
            <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) { setEditingItem(null); setPreviewUrl(""); } }}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-10 px-4 shadow-lg active:scale-95">
                <Plus className="w-4 h-4 mr-2" /> Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif font-bold italic">{editingItem ? 'Edit Equipment' : 'Create New Equipment'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2"><ImagePlus className="w-4 h-4" /> Equipment Image</Label>
                  <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-2xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer relative">
                    {(previewUrl || editingItem?.img) ? (
                      <div className="relative w-full aspect-video">
                        <Image src={previewUrl || editingItem?.img} alt="preview" fill className="rounded-xl object-cover" />
                      </div>
                    ) : (
                      <div className="py-8 flex flex-col items-center text-muted-foreground">
                        <ImagePlus className="w-12 h-12 mb-2" />
                        <span className="text-sm">Click to upload image</span>
                      </div>
                    )}
                    <Label htmlFor="file-upload" className="absolute inset-0 cursor-pointer opacity-0 z-10">Upload</Label>
                    <Input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                    {isUploading && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-2xl z-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2"><Package2 className="w-4 h-4" /> Item Name</Label>
                    <Input id="name" name="name" defaultValue={editingItem?.name} required className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-semibold flex items-center gap-2"><Tag className="w-4 h-4" /> Category</Label>
                    <Input id="category" name="category" defaultValue={editingItem?.category} required className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-sm font-semibold flex items-center gap-2"><Hash className="w-4 h-4" /> Stock Quantity</Label>
                  <Input id="stock" name="stock" type="number" defaultValue={editingItem?.stock} required className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2"><FileText className="w-4 h-4" /> Description</Label>
                  <Textarea id="description" name="description" defaultValue={editingItem?.description} placeholder="Provide details..." className="min-h-[120px] rounded-xl resize-none" required />
                </div>
                <Button type="submit" className="w-full h-12 text-lg font-semibold rounded-xl" disabled={isUploading}>{editingItem ? 'Update Equipment' : 'Save Equipment'}</Button>
              </form>
            </DialogContent>
          </Dialog>
          <Badge variant="secondary" className="px-4 py-1.5 text-sm font-bold rounded-full">ADMIN MODE</Badge>
        </div>
      </div>

      {/* --- Search & Category Filter Section --- */}
      <div className="flex flex-col md:flex-row items-center gap-4 pb-2">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-full bg-card shadow-sm focus-visible:ring-primary"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Category:</span>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px] rounded-full bg-card shadow-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Section */}
      <Card className="rounded-3xl shadow-xl border-border overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="p-5 font-bold uppercase">Equipment Details</TableHead>
                <TableHead className="p-5 font-bold uppercase">Category</TableHead>
                <TableHead className="p-5 text-center font-bold uppercase">Stock</TableHead>
                <TableHead className="p-5 text-center font-bold uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((item) => (
                <ItemTableRow
                  key={item.id}
                  item={item}
                  onEdit={() => { setEditingItem(item); setIsDialogOpen(true); }}
                  onDelete={() => { setItemToDelete({ id: item.id, name: item.name }); setDeleteConfirmOpen(true); }}
                />
              ))}
              {paginatedItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Package2 className="w-12 h-12 text-muted-foreground" />
                      <p className="text-muted-foreground italic">No items found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- Pagination Controls --- */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <p className="text-sm text-muted-foreground italic">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length}
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

      {/* Popups & Alerts */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex flex-col items-center gap-2 pt-4">
            {dialogStatus.type === 'success' ? <CheckCircle2 className="h-12 w-12 text-green-500" /> : <AlertCircle className="h-12 w-12 text-destructive" />}
            <DialogTitle className="text-xl">{dialogStatus.title}</DialogTitle>
            <DialogDescription>{dialogStatus.desc}</DialogDescription>
          </DialogHeader>
          <DialogFooter><Button className="w-full" onClick={() => setDialogOpen(false)}>รับทราบ</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบข้อมูล?</AlertDialogTitle>
            <AlertDialogDescription>ต้องการลบ "{itemToDelete?.name}" ใช่หรือไม่? ไม่สามารถกู้คืนได้</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">ยืนยันการลบ</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

const ItemTableRow = memo(({ item, onEdit, onDelete }: { item: any, onEdit: () => void, onDelete: () => void }) => {
  return (
    <TableRow className="hover:bg-muted/50 transition-all group">
      <TableCell className="p-5">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border shadow-sm">
            <Image src={item.img} alt={item.name} fill className="object-cover" sizes="56px" />
          </div>
          <div className="space-y-1 min-w-0">
            <span className="font-bold block leading-tight truncate">{item.name}</span>
            <span className="text-xs text-muted-foreground block truncate max-w-[200px]">{item.description}</span>
          </div>
        </div>
      </TableCell>
      <TableCell className="p-5">
        <Badge variant="outline" className="font-semibold rounded-lg">{item.category}</Badge>
      </TableCell>
      <TableCell className="p-5 text-center">
        <span className={`font-mono font-bold text-lg ${item.stock > 0 ? "" : "text-destructive"}`}>{item.stock}</span>
      </TableCell>
      <TableCell className="p-5 text-center">
        <div className="flex items-center justify-center gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}><Edit2 className="w-4 h-4 mr-2" /> Edit</Button>
          <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={onDelete}><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
        </div>
      </TableCell>
    </TableRow>
  )
});
ItemTableRow.displayName = "ItemTableRow";