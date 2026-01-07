import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';

// Bun supports .env files automatically
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  try {
    // 1. Migrate Items
    console.log('Migrating items...');
    const itemsPath = path.join(process.cwd(), 'data', 'items.json');
    const itemsData = JSON.parse(await fs.readFile(itemsPath, 'utf8'));

    const { data: insertedItems, error: itemsError } = await supabase
      .from('items')
      .upsert(itemsData.map((item: any) => ({
        // Use old ID if it's a UUID, otherwise let Supabase generate (or use as text if schema matches)
        // Since we defined ID as UUID, we might have issues if original IDs are "1", "2"...
        // Let's try to keep them as is if we change the schema, or map them.
        name: item.name,
        img: item.img,
        stock: item.stock,
        description: item.description,
        category: item.category,
        role: item.role
      })))
      .select();

    if (itemsError) throw itemsError;
    console.log(`Migrated ${insertedItems.length} items`);

    // 2. Migrate Orders
    console.log('Migrating orders...');
    const ordersPath = path.join(process.cwd(), 'data', 'order.json');
    const ordersData = JSON.parse(await fs.readFile(ordersPath, 'utf8'));

    // We need to map item names back to item IDs if we generated new IDs
    const { data: allItems } = await supabase.from('items').select('id, name');
    const itemMap = new Map(allItems?.map(i => [i.name, i.id]));

    const ordersToInsert = ordersData.map((order: any) => ({
      user_id: order.userId,
      user_name: order.userName,
      item_id: itemMap.get(order.name),
      start_date: order.datastart,
      end_date: order.dataend,
      status: order.status.toLowerCase(),
      created_at: order.createdAt
    }));

    const { data: insertedOrders, error: ordersError } = await supabase
      .from('orders')
      .insert(ordersToInsert)
      .select();

    if (ordersError) throw ordersError;
    console.log(`Migrated ${insertedOrders.length} orders`);

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

migrate();
