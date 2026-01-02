import React from 'react'
import Image from 'next/image';
import { User } from '../../../../types/user';
import { order } from '../../../../types/order';
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ArrowRight, CalendarArrowDown, CalendarArrowUp, Gamepad2, Info } from 'lucide-react';

export default function HistoryUser() {
  const currentUser: User = {
    name: 'Faris',
    role: 'Teacher/Student'
  };

  // สมมติว่าเป็น Array ของข้อมูล (เผื่อมีหลายรายการ)
  const orders: order[] = [{
    name: 'Red Dead Redemption 2',
    img: "/rdr2.jpg",
    stock: 5,
    description: 'Arthur Morgan and the Van der Linde Gang are outlaws on the run...',
    category: 'Game',
    datastart: '2024-01-01',
    dataend: '2024-01-15',
    status: 'Completed',
    role: 'You do not talk about Fight Club.',
  },
];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ส่วนหัวหน้าเว็บ */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">History</h1>
          <p className="text-muted-foreground text-sm">Welcome back, {currentUser.name}</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
          {currentUser.role}
        </Badge>
      </div>

      <hr className="border-border" />

      {/* Orders List */}
      <div className="space-y-4">

        <Accordion type="single" collapsible className="w-full space-y-3">
          {orders.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border rounded-xl px-4 bg-card hover:bg-accent/5 transition-colors"
            >
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
                    {/* ถ้ามีรูปใช้ <img src={item.img} /> */}
                    <Image
                      src={item.img}
                      alt={item.name}
                      width={500}
                      height={500}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-none mb-2">{item.name}</p>
                    <Badge variant={item.status === 'Completed' ? 'secondary' : 'default'} className="font-normal">
                      {item.status}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pb-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Side: Info */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4" /> Description
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Internal Note</p>
                      <p className="italic text-sm">{item.role}</p>
                    </div>
                  </div>

                  {/* Right Side: Rental Period */}
                  <div className="flex flex-col justify-center">
                    <div className="bg-secondary/30 p-4 rounded-2xl border border-dashed border-primary/20">
                      <p className="text-sm font-bold mb-4 text-center">Rental Period</p>
                      <div className="flex items-center justify-around gap-2">
                        <div className="text-center">
                          <CalendarArrowDown className="mx-auto mb-2 text-primary w-5 h-5" />
                          <p className="text-xs text-muted-foreground uppercase">Start</p>
                          <p className="font-mono font-bold">{item.datastart}</p>
                        </div>

                        <ArrowRight className="text-muted-foreground/50" />

                        <div className="text-center">
                          <CalendarArrowUp className="mx-auto mb-2 text-primary w-5 h-5" />
                          <p className="text-xs text-muted-foreground uppercase">Return</p>
                          <p className="font-mono font-bold">{item.dataend}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}