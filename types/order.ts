export type OrderStatus = 'pending' | 'approved' | 'rejected' | 'returned';

export type Order = {
    id: string;
    user_id: string;
    user_name?: string;
    item_id: string;
    start_date: string;
    end_date: string;
    status: OrderStatus;
    created_at: string;
    // Join กับตาราง Items เพื่อดึงชื่อสินค้ามาแสดง
    items?: {
        name: string;
        img: string;
    };
};