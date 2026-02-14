// User types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  created_at: string;
}

// Menu item types
export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: 'Tacos' | 'Tortas' | 'Burritos' | 'Quesadillas' | 'Birria' | 'Sopes' | 'Gorditas' | 'Drinks' | 'Chips' | 'Plates';
  is_premium: boolean;
  is_available: boolean;
  image_url?: string;
  created_at: string;
}

// Order types
export interface Order {
  id: string;
  customer_email: string;
  customer_phone?: string;
  total_amount: number;
  status: 'pending' | 'paid' | 'ready' | 'completed';
  stripe_payment_id?: string;
  stripe_session_id?: string;
  order_items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  menu_item?: MenuItem;
  quantity: number;
  unit_price: number;
  created_at: string;
}

// Cart types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

// SMS subscriber types
export interface SMSSubscriber {
  id: string;
  phone_number: string;
  opted_in: boolean;
  created_at: string;
}

// Stripe types
export interface StripeCheckoutSession {
  id: string;
  payment_status: 'paid' | 'unpaid';
  customer_email: string;
}
