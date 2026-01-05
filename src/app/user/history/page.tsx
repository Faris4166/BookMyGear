import React from 'react'
import Image from 'next/image';
import { promises as fs } from 'fs';
import path from 'path';
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowRight, CalendarArrowDown, CalendarArrowUp, Info } from 'lucide-react';

import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function HistoryUser() {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  let orders = [];
  try {
    const filePath = path.join(process.cwd(), 'data', 'order.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const allOrders = JSON.parse(fileContent);
    // Filter and sort orders to show latest first
    orders = allOrders
      .filter((order: any) => order.userId === user.id)
      .sort((a: any, b: any) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : Number(a.id) || 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : Number(b.id) || 0;
        return timeB - timeA;
      });
  } catch (e) { orders = []; }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">History</h1>
      <div className="space-y-4">
        {orders.length === 0 ? <p className="text-center text-muted-foreground">ไม่มีประวัติ</p> : (
          <Accordion type="single" collapsible className="w-full space-y-3">
            {orders.map((item: any, index: number) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-xl px-4 bg-card">
                <AccordionTrigger className="py-6">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden">
                      <Image src={item.img} alt={item.name} width={50} height={50} className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <p className="font-bold text-lg mb-2">{item.name}</p>
                      <Badge
                        variant={
                          item.status === 'Approved' ? 'secondary' :
                            item.status === 'Rejected' ? 'destructive' :
                              'outline'
                        }
                      >
                        {
                          item.status === 'Pending' ? 'รอการอนุญาต' :
                            item.status === 'Approved' ? 'ได้รับอนุญาตแล้ว' :
                              item.status === 'Rejected' ? 'ไม่ได้รับอนุญาต' :
                                item.status
                        }
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div><h4 className="text-sm font-semibold flex items-center gap-2"><Info className="w-4 h-4" /> Description</h4><p className="text-sm text-muted-foreground">{item.description}</p></div>
                      <div className="p-3 bg-muted rounded-lg"><p className="italic text-sm">{item.role}</p></div>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-2xl border border-dashed flex items-center justify-around">
                      <div className="text-center"><CalendarArrowDown className="mx-auto mb-2 text-primary" /><p className="text-xs uppercase">Start</p><p className="font-bold">{item.datastart}</p></div>
                      <ArrowRight className="text-muted-foreground/50" />
                      <div className="text-center"><CalendarArrowUp className="mx-auto mb-2 text-primary" /><p className="text-xs uppercase">Return</p><p className="font-bold">{item.dataend}</p></div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  )
}