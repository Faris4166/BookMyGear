import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

// GET: ดึงสินค้าทั้งหมด
export async function GET() {
    console.log('--- GET /api/items starting ---');
    try {
        console.log('Connecting to Supabase at:', process.env.NEXT_PUBLIC_SUPABASE_URL);
        const { data, error } = await supabase
            .from('items')
            .select('*');

        if (error) {
            console.error('Supabase error in GET /api/items:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        
        console.log('GET /api/items success, count:', data?.length);
        if (data && data.length > 0) {
            console.log('First item sample:', JSON.stringify(data[0]).substring(0, 100));
        }
        return NextResponse.json(data);
    } catch (err: any) {
        console.error('Catch error in GET /api/items:', err);
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