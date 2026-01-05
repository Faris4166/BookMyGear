"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
// 1. เพิ่ม useUser เข้ามาใน import
import { UserButton, SignedIn, useUser } from "@clerk/nextjs"
import { 
  Package2, 
  History, 
  Home, 
  Menu, 
  Boxes, 
  ClipboardList 
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "./ModeToggle"

const userNavItems = [
  { title: "Home", href: "/user/home", icon: Home },
  { title: "History", href: "/user/history", icon: History },
]

const adminNavItems = [
  { title: "Manage Items", href: "/admin/manage-items", icon: Boxes },
  { title: "Manage Orders", href: "/admin/manage-order", icon: ClipboardList },
]

export function Navbar() {
  const pathname = usePathname()
  
  // 2. ดึงสถานะการ Login
  const { isSignedIn, isLoaded } = useUser();

  // 3. เงื่อนไขสำคัญ: ถ้ายังโหลดไม่เสร็จ หรือ ยังไม่ Login -> ไม่ต้องแสดง Navbar เลย (return null)
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  // --- โค้ดส่วนที่เหลือเหมือนเดิม ---
  const isAdminPath = pathname.startsWith('/admin')
  const navItems = isAdminPath ? adminNavItems : userNavItems

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-10">
          <Link href={isAdminPath ? "/admin/manage-items" : "/user/home"} className="flex items-center space-x-2 group">
            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Package2 className="h-6 w-6 text-primary" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              BookMyGear
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "relative h-10 px-5 text-sm font-medium transition-all hover:bg-transparent",
                          isActive ? "text-primary bg-accent/50" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {item.title}
                        {isActive && (
                          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                        )}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          
          <div className="hidden md:block">
            <ModeToggle />
          </div>

          <SignedIn>
            <div className="flex items-center gap-3 pl-4 border-l border-border/60">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9 border-2 border-primary/20 hover:border-primary/50 transition-all shadow-sm",
                  }
                }}
              />
            </div>
          </SignedIn>

          {/* Mobile Drawer */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full hover:bg-secondary">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l-border/40 backdrop-blur-lg">
              <div className="flex flex-col gap-6 mt-10">
                <div className="px-2">
                   <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-4 px-4">
                     {isAdminPath ? "Admin Management" : "Main Menu"}
                   </h2>
                   <nav className="flex flex-col gap-2">
                    <div className="px-4 mb-2">
                      <ModeToggle />
                    </div>
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 text-base font-semibold p-4 rounded-2xl transition-all",
                          pathname === item.href 
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                            : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.title}
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}