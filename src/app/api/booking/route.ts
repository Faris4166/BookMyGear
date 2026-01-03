import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(request: Request) {
    try {
        const user = await currentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const data = await request.json();
        const filePath = path.join(process.cwd(), 'data', 'order.json');
        
        let orders = [];
        try {
            const fileContent = await fs.readFile(filePath, 'utf8');
            orders = JSON.parse(fileContent);
        } catch (e) { orders = []; }

        const newOrder = {
            ...data,
            id: Date.now().toString(),
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };

        orders.push(newOrder);
        await fs.writeFile(filePath, JSON.stringify(orders, null, 2), 'utf8');
        return NextResponse.json({ message: 'Success', order: newOrder });
    } catch (error) { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}