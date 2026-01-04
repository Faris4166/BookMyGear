"use client"
import React, { useState, useEffect } from 'react'
import { useUser } from "@clerk/nextjs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Plus, Edit2, RefreshCcw, ImagePlus, Package2, Tag, Hash, FileText } from "lucide-react"
import Image from 'next/image'

export default function ManageItemsPage() {
  const { user } = useUser();
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")

  const fetchItems = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/items')
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (e) { 
      console.error(e) 
    } finally { 
      setLoading(false) 
    }
  }

  useEffect(() => { fetchItems() }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        fetchItems()
      }
    } catch (e) { 
      alert("Error saving item") 
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      setPreviewUrl(data.url)
    } catch (e) { 
      alert("Upload failed") 
    } finally { 
      setIsUploading(false) 
    }
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin w-8 h-8 text-primary" />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* --- Header Section (Responsive Layout) --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-slate-900">
            Manage Items
          </h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            Welcome back, <span className="font-semibold text-foreground">{user?.firstName || 'Admin'}</span>
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={fetchItems} variant="outline" size="sm" className="h-10 px-4 transition-all active:scale-95">
            <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) { setEditingItem(null); setPreviewUrl(""); } }}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-10 px-4 bg-slate-900 shadow-lg hover:bg-slate-800 transition-all active:scale-95">
                <Plus className="w-4 h-4 mr-2" /> Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif font-bold italic">
                  {editingItem ? 'Edit Equipment' : 'Create New Equipment'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                {/* Image Upload Area */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <ImagePlus className="w-4 h-4" /> Equipment Image
                  </Label>
                  <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative group">
                    {(previewUrl || editingItem?.img) ? (
                      <div className="relative w-full aspect-video">
                        <Image 
                          src={previewUrl || editingItem?.img} 
                          alt="preview" 
                          fill 
                          className="rounded-xl object-cover shadow-sm" 
                        />
                      </div>
                    ) : (
                      <div className="py-8 flex flex-col items-center text-slate-400">
                        <ImagePlus className="w-12 h-12 mb-2" />
                        <span className="text-sm">Click to upload image</span>
                      </div>
                    )}
                    <Label htmlFor="file-upload" className="absolute inset-0 cursor-pointer opacity-0 z-10">
                      Upload
                    </Label>
                    <Input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                    {isUploading && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl z-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                      <Package2 className="w-4 h-4" /> Item Name
                    </Label>
                    <Input id="name" name="name" defaultValue={editingItem?.name} required className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-semibold flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Category
                    </Label>
                    <Input id="category" name="category" defaultValue={editingItem?.category} required className="rounded-xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-sm font-semibold flex items-center gap-2">
                    <Hash className="w-4 h-4" /> Stock Quantity
                  </Label>
                  <Input id="stock" name="stock" type="number" defaultValue={editingItem?.stock} required className="rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Description
                  </Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    defaultValue={editingItem?.description} 
                    placeholder="Provide details about the equipment..."
                    className="min-h-[120px] leading-relaxed rounded-xl resize-none"
                    required 
                  />
                </div>

                <Button type="submit" className="w-full bg-slate-900 h-12 text-lg font-semibold rounded-xl" disabled={isUploading}>
                  {editingItem ? 'Update Equipment' : 'Save Equipment'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Badge variant="secondary" className="px-4 py-1.5 text-sm font-bold bg-slate-900 text-white rounded-full shadow-sm">
            ADMIN MODE
          </Badge>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* --- Responsive Table/Card Section --- */}
      <div className="border rounded-3xl overflow-hidden bg-white shadow-xl shadow-slate-200/50 border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-slate-50/80 backdrop-blur-sm border-b text-sm font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="p-5">Equipment Details</th>
                <th className="p-5">Category</th>
                <th className="p-5 text-center">Available Stock</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden border shadow-sm group-hover:scale-105 transition-transform">
                        <Image src={item.img} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 block leading-tight">{item.name}</span>
                        <span className="text-xs text-slate-400 line-clamp-1">{item.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <Badge variant="outline" className="font-semibold px-3 py-1 bg-white border-slate-200 rounded-lg">
                      {item.category}
                    </Badge>
                  </td>
                  <td className="p-5 text-center">
                    <span className={`font-mono font-bold text-lg ${item.stock > 0 ? "text-slate-700" : "text-rose-500"}`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-slate-900 hover:text-white rounded-xl transition-all active:scale-95"
                      onClick={() => { setEditingItem(item); setIsDialogOpen(true); }}
                    >
                      <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="p-20 text-center space-y-3">
              <Package2 className="w-12 h-12 mx-auto text-slate-200" />
              <p className="text-slate-400 font-medium italic">No equipment found in the inventory.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}