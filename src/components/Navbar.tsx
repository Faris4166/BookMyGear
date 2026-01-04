"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton, SignedIn } from "@clerk/nextjs"
import { Package2, History, Home, Menu, LayoutDashboard } from "lucide-react"

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

const navItems = [
  { title: "Home", href: "/user/home", icon: Home },
  { title: "History", href: "/user/history", icon: History },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-10">
          <Link href="/user/home" className="flex items-center space-x-2 group">
            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Package2 className="h-6 w-6 text-primary" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              EQUIP<span className="text-primary">HUB</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <NavigationMenuItem key={item.href}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "relative h-10 px-5 text-sm font-medium transition-all hover:bg-transparent",
                          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {item.title}
                        {isActive && (
                          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                        )}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block mr-2 text-right">
             <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Status</p>
             <p className="text-xs font-medium text-green-500 flex items-center gap-1 justify-end">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> 
               Authorized
             </p>
          </div>

          <SignedIn>
            <div className="flex items-center gap-3 pl-4 border-l border-border/60">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9 border-2 border-primary/20 hover:border-primary/50 transition-all shadow-sm",
                    userButtonPopoverCard: "shadow-2xl border-border/50"
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
                   <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-4">Main Menu</h2>
                   <nav className="flex flex-col gap-2">
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