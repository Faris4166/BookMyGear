import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

// GET: ดึงสินค้าทั้งหมด
export async function GET() {
    console.log('--- GET /api/items ---');
    try {
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase fetch error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        
        console.log(`Found ${data?.length || 0} items`);
        return NextResponse.json(data);
    } catch (err: any) {
        console.error('API Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST: เพิ่มสินค้า (เฉพาะคน Login)
export async function POST(request: Request) {
    console.log('--- POST /api/items ---');
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await request.json();
        console.log('Received body:', body);

        const { data, error } = await supabase
            .from('items')
            .insert([{
                name: body.name,
                img: body.img || '',
                stock: Number(body.stock),
                description: body.description || '',
                category: body.category,
                role: body.role || 'user'
            }])
            .select();

        if (error) {
            console.error('Supabase insert error:', error);
            throw error;
        }
        return NextResponse.json(data[0], { status: 201 });
    } catch (error: any) {
        console.error('Catch error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH: แก้ไขสินค้า
export async function PATCH(request: Request) {
    console.log('--- PATCH /api/items ---');
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await request.json();
        const { id, ...updates } = body;
        console.log('Updating item:', id, updates);

        const { data, error } = await supabase
            .from('items')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Supabase update error:', error);
            throw error;
        }
        return NextResponse.json(data[0]);
    } catch (error: any) {
        console.error('Catch error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}