import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validation check
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    rawSupabaseUrl &&
    rawSupabaseAnonKey &&
    !rawSupabaseUrl.includes('your-project-ref') &&
    rawSupabaseUrl.startsWith('https://') &&
    rawSupabaseAnonKey.length > 20
  );
};

// Safe client creation
export const supabase: SupabaseClient = createClient(
  rawSupabaseUrl || 'https://placeholder.supabase.co',
  rawSupabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);

// Database Interfaces matching requested schema
export interface SupabaseProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  price_unit: string;
  image: string;
  description: string;
  short_description: string;
  badge?: string | null;
  sort_order: number;
  status: 'available' | 'rented' | 'maintenance';
  stock: number;
  created_at?: string;
}

export interface SupabaseOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  product_id?: string | null;
  start_date: string;
  end_date: string;
  duration: number;
  total_price: number;
  status: 'pending' | 'paid' | 'ongoing' | 'completed' | 'cancelled';
  notes?: string | null;
  created_at?: string;
  // joined product info
  products?: {
    id: string;
    name: string;
    category: string;
    image: string;
  } | null;
}

// ---------------------------------------------
// Product API Services
// ---------------------------------------------

export async function fetchSupabaseProducts(): Promise<SupabaseProduct[]> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase belum dikonfigurasi. Masukkan VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY.');
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase fetch products error:', error);
    throw error;
  }

  return (data || []) as SupabaseProduct[];
}

export async function createSupabaseProduct(
  product: Omit<SupabaseProduct, 'id' | 'created_at'>
): Promise<SupabaseProduct> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase belum dikonfigurasi.');
  }

  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) {
    console.error('Supabase create product error:', error);
    throw error;
  }

  return data as SupabaseProduct;
}

export async function updateSupabaseProduct(
  id: string,
  updates: Partial<SupabaseProduct>
): Promise<SupabaseProduct> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase belum dikonfigurasi.');
  }

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Supabase update product error:', error);
    throw error;
  }

  return data as SupabaseProduct;
}

export async function deleteSupabaseProduct(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase belum dikonfigurasi.');
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Supabase delete product error:', error);
    throw error;
  }

  return true;
}

// ---------------------------------------------
// Order API Services
// ---------------------------------------------

export async function fetchSupabaseOrders(): Promise<SupabaseOrder[]> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase belum dikonfigurasi.');
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*, products(id, name, category, image)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase fetch orders error:', error);
    throw error;
  }

  return (data || []) as SupabaseOrder[];
}

export async function createSupabaseOrder(
  order: Omit<SupabaseOrder, 'id' | 'created_at' | 'products'>
): Promise<SupabaseOrder> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase belum dikonfigurasi.');
  }

  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select('*, products(id, name, category, image)')
    .single();

  if (error) {
    console.error('Supabase create order error:', error);
    throw error;
  }

  return data as SupabaseOrder;
}

export async function updateSupabaseOrderStatus(
  id: string,
  status: SupabaseOrder['status']
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase belum dikonfigurasi.');
  }

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Supabase update order status error:', error);
    throw error;
  }

  return true;
}

export async function deleteSupabaseOrder(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase belum dikonfigurasi.');
  }

  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Supabase delete order error:', error);
    throw error;
  }

  return true;
}

// ---------------------------------------------
// Supabase Storage: Product Image Upload
// ---------------------------------------------

export interface UploadImageResult {
  publicUrl: string;
  path: string;
}

export async function uploadProductImageToStorage(
  file: File
): Promise<UploadImageResult> {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Koneksi Supabase belum aktif. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah disetel di environment variables.'
    );
  }

  const bucketName = 'product-images';
  const fileExt = file.name.split('.').pop() || 'webp';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '31536000',
      upsert: false,
      contentType: file.type || 'image/webp'
    });

  if (uploadError) {
    console.error('Supabase storage upload error:', uploadError);
    throw new Error(`Gagal upload ke Supabase Storage: ${uploadError.message}`);
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  if (!publicUrlData?.publicUrl) {
    throw new Error('Gagal mendapatkan Public URL dari Supabase Storage.');
  }

  return {
    publicUrl: publicUrlData.publicUrl,
    path: filePath
  };
}
