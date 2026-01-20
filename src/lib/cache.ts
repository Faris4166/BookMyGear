import { unstable_cache } from 'next/cache';
import { supabase } from './supabase';

/**
 * Fetch all items from Supabase with caching.
 * Revalidates every hour or when the 'items' tag is invalidated.
 */
export const getCachedItems = unstable_cache(
  async () => {
    const { data, error } = await supabase
      .from('items')
      .select('id, name, img, stock, description, category, role');

    if (error) {
      console.error('Error fetching items from Supabase:', error);
      throw error;
    }
    return data || [];
  },
  ['items-list'],
  {
    revalidate: 3600, // 1 hour
    tags: ['items'],
  }
);

/**
 * Fetch user's booking history with caching.
 * Tagged by user ID for specific invalidation.
 */
export const getCachedUserOrders = (userId: string) => 
  unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items (
            name,
            img,
            description
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders from Supabase:', error);
        throw error;
      }

      return data?.map((order: any) => ({
        ...order,
        name: order.items?.name,
        img: order.items?.img,
        description: order.items?.description,
        datastart: order.start_date,
        dataend: order.end_date,
        role: order.status === 'approved' ? 'ได้รับอนุญาตแล้ว' :
          order.status === 'rejected' ? 'ไม่ได้รับอนุญาต' :
            order.status === 'pending' ? 'รอการอนุญาต' : order.status
      })) || [];
    },
    [`user-orders-${userId}`],
    {
      revalidate: 3600, // 1 hour
      tags: ['orders', `orders-${userId}`],
    }
  )();
