
export interface Donation {
    id: string;
    user_id: string;
    item_name: string;
    description: string;
    category: 'clothing' | 'food' | 'electronics' | 'other';
    quantity: number;
    status: 'pending' | 'matched' | 'delivered';
    photos: string[];
    created_at: Date;
  }