import {
  Product,
  ProductPrice,
  Booking,
  HeroVideo,
  CustomerReview,
  MediaItem,
  WebsiteSettings,
  AdminStats
} from './types.js';
import {
  INITIAL_PRODUCTS,
  INITIAL_PRODUCT_PRICES,
  INITIAL_HERO_VIDEOS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
  INITIAL_MEDIA
} from './data/initialData.js';

import {
  isSupabaseConfigured,
  fetchSupabaseProducts,
  createSupabaseProduct,
  updateSupabaseProduct,
  deleteSupabaseProduct,
  fetchSupabaseOrders,
  createSupabaseOrder,
  updateSupabaseOrderStatus,
  deleteSupabaseOrder,
  SupabaseProduct,
  SupabaseOrder
} from './lib/supabase.js';

const API_BASE = '/api';

export function isUUID(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

export function mapSupabaseProductToProduct(sp: SupabaseProduct): Product {
  const primaryPrice = Number(sp.price) || 0;
  const priceUnit = sp.price_unit || 'per hari';
  return {
    id: sp.id,
    slug: sp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: sp.name,
    category: (sp.category as any) || 'PS4',
    shortDesc: sp.short_description || sp.description || '',
    description: sp.description || '',
    badge: sp.badge || undefined,
    mainImage: sp.image,
    thumbnail: sp.image,
    galleryImages: [sp.image],
    includedItems: ['1x Unit Console', '2x Stick Wireless Original', 'Kabel HDMI & Power', 'Full Game Terupdate'],
    features: ['Rental PlayStation', 'Antar–jemput', 'Wilayah Mataram', 'Unit Terawat'],
    isActive: sp.status !== 'maintenance',
    isPopular: sp.badge?.toLowerCase().includes('populer') || false,
    sortOrder: sp.sort_order || 0,
    price: primaryPrice,
    price_unit: priceUnit,
    status: sp.status,
    stock: sp.stock,
    short_description: sp.short_description,
    image: sp.image,
    created_at: sp.created_at,
    prices: [
      {
        id: `pr-${sp.id}`,
        duration: priceUnit,
        price: primaryPrice,
        label: sp.badge || undefined,
        sortOrder: 1
      }
    ]
  };
}

export function mapSupabaseOrderToBooking(o: SupabaseOrder): Booking {
  const statusMap: Record<string, Booking['status']> = {
    pending: 'Pending',
    paid: 'Confirmed',
    ongoing: 'On Rental',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };

  return {
    id: o.id,
    bookingId: 'GM-' + o.id.replace(/-/g, '').substring(0, 8).toUpperCase(),
    customerName: o.customer_name,
    customerPhone: o.customer_phone,
    customerAddress: o.notes?.includes('Alamat:') ? o.notes.split('Alamat:')[1].split('.')[0].trim() : 'Mataram',
    productId: o.product_id || '',
    productName: o.products?.name || 'PlayStation Rental',
    duration: `${o.duration} Hari`,
    price: Number(o.total_price) || 0,
    startDate: o.start_date,
    endDate: o.end_date,
    notes: o.notes || '',
    status: statusMap[o.status] || 'Pending',
    createdAt: o.created_at || new Date().toISOString(),
    adminNotes: ''
  };
}

// Helper to ensure image paths are strictly absolute starting with /images/
function normalizeProductImage(src?: string, fallback = '/images/logo.jpg'): string {
  if (!src) return fallback;
  if (src.startsWith('/images/')) return src;
  if (src.startsWith('images/')) return `/${src}`;
  if (src.startsWith('/logo.')) return `/images${src}`;
  return src;
}

function sanitizeProduct(product: Product): Product {
  return {
    ...product,
    mainImage: normalizeProductImage(product.mainImage, '/images/ps4.jpg'),
    thumbnail: normalizeProductImage(product.thumbnail, normalizeProductImage(product.mainImage)),
    galleryImages: (product.galleryImages || [product.mainImage]).map(img => normalizeProductImage(img, '/images/ps4.jpg'))
  };
}

export async function fetchProducts(): Promise<Product[]> {
  // 1. Try Supabase first if configured
  if (isSupabaseConfigured()) {
    try {
      const sps = await fetchSupabaseProducts();
      if (sps && sps.length > 0) {
        const mapped = sps.map(mapSupabaseProductToProduct);
        try {
          localStorage.setItem('gm_cached_products', JSON.stringify(mapped));
        } catch {}
        return mapped;
      }
    } catch (err) {
      console.warn('Supabase fetchProducts notice:', err);
    }
  }

  // 2. Try Local API
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const sanitized = data.map(sanitizeProduct);
        try {
          localStorage.setItem('gm_cached_products', JSON.stringify(sanitized));
        } catch {}
        return sanitized;
      }
    }
  } catch (err) {
    // ignore
  }

  // 3. Fallback to localStorage or static INITIAL_PRODUCTS
  try {
    const cached = localStorage.getItem('gm_cached_products');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(sanitizeProduct);
      }
    }
  } catch {}

  return INITIAL_PRODUCTS.map(sanitizeProduct);
}

export async function fetchProductById(id: string): Promise<Product> {
  const all = await fetchProducts();
  const found = all.find(p => p.id === id || p.slug === id);
  if (found) return found;

  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (res.ok) {
      const data = await res.json();
      return sanitizeProduct(data);
    }
  } catch {}

  throw new Error('Produk tidak ditemukan');
}

export async function createProductApi(product: Partial<Product>): Promise<Product> {
  // 1. If Supabase is configured, save directly to Supabase products table
  if (isSupabaseConfigured()) {
    try {
      const sp = await createSupabaseProduct({
        name: product.name || 'Unit Baru',
        category: product.category || 'PS4',
        price: Number(product.price) || (product.prices?.[0]?.price) || 90000,
        price_unit: product.price_unit || 'per hari',
        image: product.image || product.mainImage || '/images/ps4.jpg',
        description: product.description || '',
        short_description: product.short_description || product.shortDesc || '',
        badge: product.badge || null,
        sort_order: Number(product.sortOrder) || 0,
        status: product.status || (product.isActive ? 'available' : 'maintenance'),
        stock: Number(product.stock) || 1
      });
      return mapSupabaseProductToProduct(sp);
    } catch (err) {
      console.warn('Supabase createProduct notice, using fallback:', err);
    }
  }

  // 2. Fallback to Local API
  try {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (res.ok) {
      return sanitizeProduct(await res.json());
    }
  } catch {}

  // 3. Fallback to local state / cache
  const all = await fetchProducts();
  const newProduct: Product = sanitizeProduct({
    id: 'prod-' + Date.now(),
    slug: product.slug || (product.name || 'unit').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: product.name || 'Unit Baru',
    category: product.category || 'PS4',
    shortDesc: product.shortDesc || product.short_description || '',
    description: product.description || '',
    badge: product.badge,
    mainImage: normalizeProductImage(product.mainImage || product.image, '/images/ps4.jpg'),
    thumbnail: normalizeProductImage(product.thumbnail || product.mainImage || product.image, '/images/ps4.jpg'),
    galleryImages: [normalizeProductImage(product.mainImage || product.image, '/images/ps4.jpg')],
    includedItems: product.includedItems || [],
    features: product.features || [],
    isActive: product.isActive ?? true,
    isPopular: product.isPopular ?? false,
    sortOrder: product.sortOrder || all.length + 1,
    prices: product.prices || [
      {
        id: 'pr-1',
        duration: product.price_unit || '1 Hari',
        price: Number(product.price) || 90000,
        sortOrder: 1
      }
    ],
    price: Number(product.price) || 90000,
    price_unit: product.price_unit || 'per hari',
    status: product.status || 'available',
    stock: Number(product.stock) || 1
  });

  all.push(newProduct);
  try {
    localStorage.setItem('gm_cached_products', JSON.stringify(all));
  } catch {}
  return newProduct;
}

export async function updateProductApi(id: string, updates: Partial<Product>): Promise<Product> {
  // 1. If Supabase is configured and it is a UUID, update Supabase
  if (isSupabaseConfigured() && isUUID(id)) {
    try {
      const supabaseUpdates: Partial<SupabaseProduct> = {};
      if (updates.name !== undefined) supabaseUpdates.name = updates.name;
      if (updates.category !== undefined) supabaseUpdates.category = updates.category;
      if (updates.price !== undefined) supabaseUpdates.price = Number(updates.price);
      if (updates.price_unit !== undefined) supabaseUpdates.price_unit = updates.price_unit;
      if (updates.mainImage !== undefined || updates.image !== undefined) {
        supabaseUpdates.image = updates.image || updates.mainImage;
      }
      if (updates.description !== undefined) supabaseUpdates.description = updates.description;
      if (updates.shortDesc !== undefined || updates.short_description !== undefined) {
        supabaseUpdates.short_description = updates.short_description || updates.shortDesc;
      }
      if (updates.badge !== undefined) supabaseUpdates.badge = updates.badge || null;
      if (updates.sortOrder !== undefined) supabaseUpdates.sort_order = Number(updates.sortOrder);
      if (updates.status !== undefined) supabaseUpdates.status = updates.status;
      if (updates.isActive !== undefined && updates.status === undefined) {
        supabaseUpdates.status = updates.isActive ? 'available' : 'maintenance';
      }
      if (updates.stock !== undefined) supabaseUpdates.stock = Number(updates.stock);

      const updated = await updateSupabaseProduct(id, supabaseUpdates);
      return mapSupabaseProductToProduct(updated);
    } catch (err) {
      console.warn('Supabase updateProduct notice, using fallback:', err);
    }
  }

  // 2. Fallback to Local API
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      return sanitizeProduct(await res.json());
    }
  } catch {}

  // 3. Fallback to local state / cache
  const all = await fetchProducts();
  const idx = all.findIndex(p => p.id === id);
  if (idx !== -1) {
    all[idx] = sanitizeProduct({ ...all[idx], ...updates });
    try {
      localStorage.setItem('gm_cached_products', JSON.stringify(all));
    } catch {}
    return all[idx];
  }
  throw new Error('Produk tidak ditemukan');
}

export async function deleteProductApi(id: string): Promise<{ success: boolean }> {
  // 1. If Supabase is configured and is UUID, delete from Supabase
  if (isSupabaseConfigured() && isUUID(id)) {
    try {
      await deleteSupabaseProduct(id);
      return { success: true };
    } catch (err) {
      console.warn('Supabase deleteProduct notice, using fallback:', err);
    }
  }

  // 2. Fallback to Local API
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    if (res.ok) return await res.json();
  } catch {}

  // 3. Fallback to cache
  const all = await fetchProducts();
  const filtered = all.filter(p => p.id !== id);
  try {
    localStorage.setItem('gm_cached_products', JSON.stringify(filtered));
  } catch {}
  return { success: true };
}


export async function fetchPrices(): Promise<ProductPrice[]> {
  try {
    const res = await fetch(`${API_BASE}/prices`);
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  try {
    const cached = localStorage.getItem('gm_cached_prices');
    if (cached) return JSON.parse(cached);
  } catch {}

  return INITIAL_PRODUCT_PRICES;
}

export async function createPriceApi(priceData: Partial<ProductPrice>): Promise<ProductPrice> {
  try {
    const res = await fetch(`${API_BASE}/prices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(priceData)
    });
    if (res.ok) return await res.json();
  } catch {}

  const all = await fetchPrices();
  const newPrice: ProductPrice = {
    id: 'pr-' + Date.now(),
    productId: priceData.productId || 'prod-ps4',
    duration: priceData.duration || '1 Hari',
    price: Number(priceData.price) || 0,
    label: priceData.label,
    sortOrder: priceData.sortOrder || all.length + 1
  };
  all.push(newPrice);
  try {
    localStorage.setItem('gm_cached_prices', JSON.stringify(all));
  } catch {}
  return newPrice;
}

export async function updatePriceApi(id: string, updates: Partial<ProductPrice>): Promise<ProductPrice> {
  try {
    const res = await fetch(`${API_BASE}/prices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) return await res.json();
  } catch {}

  const all = await fetchPrices();
  const idx = all.findIndex(p => p.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    try {
      localStorage.setItem('gm_cached_prices', JSON.stringify(all));
    } catch {}
    return all[idx];
  }
  throw new Error('Data harga tidak ditemukan');
}

export async function deletePriceApi(id: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/prices/${id}`, { method: 'DELETE' });
    if (res.ok) return await res.json();
  } catch {}

  const all = await fetchPrices();
  const filtered = all.filter(p => p.id !== id);
  try {
    localStorage.setItem('gm_cached_prices', JSON.stringify(filtered));
  } catch {}
  return { success: true };
}

export async function fetchBookings(): Promise<Booking[]> {
  // 1. Try Supabase first if configured
  if (isSupabaseConfigured()) {
    try {
      const orders = await fetchSupabaseOrders();
      if (orders && orders.length > 0) {
        const mapped = orders.map(mapSupabaseOrderToBooking);
        try {
          localStorage.setItem('gm_cached_bookings', JSON.stringify(mapped));
        } catch {}
        return mapped;
      }
    } catch (err) {
      console.warn('Supabase fetchOrders notice:', err);
    }
  }

  // 2. Try Local API
  try {
    const res = await fetch(`${API_BASE}/bookings`);
    if (res.ok) return await res.json();
  } catch {}

  // 3. Fallback to cache
  try {
    const cached = localStorage.getItem('gm_cached_bookings');
    if (cached) return JSON.parse(cached);
  } catch {}

  return [
    {
      id: 'bk-sample-1',
      bookingId: 'GM-20260918-001',
      customerName: 'Muhammad Aditya',
      customerPhone: '081912345678',
      customerAddress: 'Jl. Pemuda No. 12, Mataram',
      productId: 'prod-ps4',
      productName: 'PlayStation 4 Slim',
      duration: '2 Hari',
      price: 180000,
      startDate: '2026-09-18',
      endDate: '2026-09-20',
      notes: 'Minta stick warna hitam dan game FIFA 24',
      status: 'Completed',
      createdAt: '2026-09-18T10:00:00.000Z',
      adminNotes: 'Selesai disewa dan unit dikembalikan dengan kondisi mulus'
    }
  ];
}

export async function fetchBookingById(id: string): Promise<Booking> {
  const all = await fetchBookings();
  const found = all.find(b => b.id === id || b.bookingId.toLowerCase() === id.toLowerCase());
  if (found) return found;

  try {
    const res = await fetch(`${API_BASE}/bookings/${id}`);
    if (res.ok) return await res.json();
  } catch {}

  throw new Error('Booking ID tidak ditemukan');
}

export async function createBookingApi(booking: {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  productId: string;
  productName: string;
  duration: string;
  price: number;
  startDate: string;
  endDate: string;
  notes?: string;
}): Promise<Booking> {
  // 1. If Supabase is configured, create order in Supabase orders table
  if (isSupabaseConfigured()) {
    try {
      const days = parseInt(booking.duration) || 1;
      const order = await createSupabaseOrder({
        customer_name: booking.customerName,
        customer_phone: booking.customerPhone,
        product_id: isUUID(booking.productId) ? booking.productId : null,
        start_date: booking.startDate,
        end_date: booking.endDate,
        duration: days,
        total_price: Number(booking.price) || 0,
        status: 'pending',
        notes: `${booking.customerAddress ? 'Alamat: ' + booking.customerAddress + '. ' : ''}${booking.notes || ''}`
      });
      const mapped = mapSupabaseOrderToBooking(order);
      mapped.productName = booking.productName || mapped.productName;
      mapped.customerAddress = booking.customerAddress || mapped.customerAddress;
      return mapped;
    } catch (err) {
      console.warn('Supabase createOrder notice, using fallback:', err);
    }
  }

  // 2. Fallback to Local API
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    if (res.ok) return await res.json();
  } catch {}

  // 3. Fallback to local cache
  const all = await fetchBookings();
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const todayPrefix = `GM-${yyyy}${mm}${dd}`;
  const countToday = all.filter(b => b.bookingId.startsWith(todayPrefix)).length + 1;
  const bookingId = `${todayPrefix}-${String(countToday).padStart(3, '0')}`;

  const newBooking: Booking = {
    id: 'bk-' + Date.now(),
    bookingId,
    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    customerAddress: booking.customerAddress,
    productId: booking.productId,
    productName: booking.productName,
    duration: booking.duration,
    price: Number(booking.price) || 0,
    startDate: booking.startDate,
    endDate: booking.endDate,
    notes: booking.notes || '',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    adminNotes: ''
  };

  all.unshift(newBooking);
  try {
    localStorage.setItem('gm_cached_bookings', JSON.stringify(all));
  } catch {}
  return newBooking;
}

export async function updateBookingStatusApi(
  id: string,
  status: Booking['status'],
  adminNotes?: string
): Promise<Booking> {
  // 1. If Supabase is configured and is UUID, update Supabase orders table
  if (isSupabaseConfigured() && isUUID(id)) {
    try {
      const statusMap: Record<Booking['status'], SupabaseOrder['status']> = {
        Pending: 'pending',
        Confirmed: 'paid',
        'On Rental': 'ongoing',
        Completed: 'completed',
        Cancelled: 'cancelled'
      };
      await updateSupabaseOrderStatus(id, statusMap[status] || 'pending');
      const all = await fetchBookings();
      const found = all.find(b => b.id === id);
      if (found) {
        found.status = status;
        return found;
      }
    } catch (err) {
      console.warn('Supabase updateOrderStatus notice, using fallback:', err);
    }
  }

  // 2. Fallback to Local API
  try {
    const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNotes })
    });
    if (res.ok) return await res.json();
  } catch {}

  // 3. Fallback to cache
  const all = await fetchBookings();
  const found = all.find(b => b.id === id || b.bookingId === id);
  if (found) {
    found.status = status;
    if (adminNotes !== undefined) found.adminNotes = adminNotes;
    try {
      localStorage.setItem('gm_cached_bookings', JSON.stringify(all));
    } catch {}
    return found;
  }
  throw new Error('Booking tidak ditemukan');
}

export async function deleteBookingApi(id: string): Promise<{ success: boolean }> {
  // 1. If Supabase is configured and is UUID, delete from Supabase orders
  if (isSupabaseConfigured() && isUUID(id)) {
    try {
      await deleteSupabaseOrder(id);
      return { success: true };
    } catch (err) {
      console.warn('Supabase deleteOrder notice, using fallback:', err);
    }
  }

  // 2. Fallback to Local API
  try {
    const res = await fetch(`${API_BASE}/bookings/${id}`, { method: 'DELETE' });
    if (res.ok) return await res.json();
  } catch {}

  // 3. Fallback to cache
  const all = await fetchBookings();
  const filtered = all.filter(b => b.id !== id && b.bookingId !== id);
  try {
    localStorage.setItem('gm_cached_bookings', JSON.stringify(filtered));
  } catch {}
  return { success: true };
}

export async function fetchHeroVideos(): Promise<HeroVideo[]> {
  try {
    const res = await fetch(`${API_BASE}/hero-videos`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {}

  try {
    const cached = localStorage.getItem('gm_cached_hero_videos');
    if (cached) return JSON.parse(cached);
  } catch {}

  return INITIAL_HERO_VIDEOS;
}

export async function createHeroVideoApi(video: Partial<HeroVideo>): Promise<HeroVideo> {
  try {
    const res = await fetch(`${API_BASE}/hero-videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(video)
    });
    if (res.ok) return await res.json();
  } catch {}

  const all = await fetchHeroVideos();
  const newVideo: HeroVideo = {
    id: 'vid-' + Date.now(),
    title: video.title || 'Video Hero',
    subtitle: video.subtitle || '',
    videoUrl: video.videoUrl || '',
    thumbnailUrl: video.thumbnailUrl || '/images/hero-1.jpg',
    isActive: video.isActive ?? true,
    sortOrder: video.sortOrder || all.length + 1
  };
  all.push(newVideo);
  try {
    localStorage.setItem('gm_cached_hero_videos', JSON.stringify(all));
  } catch {}
  return newVideo;
}

export async function updateHeroVideoApi(id: string, updates: Partial<HeroVideo>): Promise<HeroVideo> {
  try {
    const res = await fetch(`${API_BASE}/hero-videos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) return await res.json();
  } catch {}

  const all = await fetchHeroVideos();
  const idx = all.findIndex(v => v.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    try {
      localStorage.setItem('gm_cached_hero_videos', JSON.stringify(all));
    } catch {}
    return all[idx];
  }
  throw new Error('Video hero tidak ditemukan');
}

export async function deleteHeroVideoApi(id: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/hero-videos/${id}`, { method: 'DELETE' });
    if (res.ok) return await res.json();
  } catch {}

  const all = await fetchHeroVideos();
  const filtered = all.filter(v => v.id !== id);
  try {
    localStorage.setItem('gm_cached_hero_videos', JSON.stringify(filtered));
  } catch {}
  return { success: true };
}

export async function fetchReviews(): Promise<CustomerReview[]> {
  try {
    const res = await fetch(`${API_BASE}/reviews`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {}

  try {
    const cached = localStorage.getItem('gm_cached_reviews');
    if (cached) return JSON.parse(cached);
  } catch {}

  return INITIAL_REVIEWS;
}

export async function createReviewApi(review: Partial<CustomerReview>): Promise<CustomerReview> {
  try {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    if (res.ok) return await res.json();
  } catch {}

  const all = await fetchReviews();
  const newReview: CustomerReview = {
    id: 'rev-' + Date.now(),
    customerName: review.customerName || 'Customer',
    customerPhoto: review.customerPhoto || '/images/avatar-1.jpg',
    rating: review.rating || 5,
    comment: review.comment || '',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    location: review.location || 'Mataram',
    isVerified: review.isVerified ?? true,
    isApproved: review.isApproved ?? true,
    showOnHomepage: review.showOnHomepage ?? true
  };
  all.unshift(newReview);
  try {
    localStorage.setItem('gm_cached_reviews', JSON.stringify(all));
  } catch {}
  return newReview;
}

export async function updateReviewApi(id: string, updates: Partial<CustomerReview>): Promise<CustomerReview> {
  try {
    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) return await res.json();
  } catch {}

  const all = await fetchReviews();
  const idx = all.findIndex(r => r.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    try {
      localStorage.setItem('gm_cached_reviews', JSON.stringify(all));
    } catch {}
    return all[idx];
  }
  throw new Error('Review tidak ditemukan');
}

export async function deleteReviewApi(id: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/reviews/${id}`, { method: 'DELETE' });
    if (res.ok) return await res.json();
  } catch {}

  const all = await fetchReviews();
  const filtered = all.filter(r => r.id !== id);
  try {
    localStorage.setItem('gm_cached_reviews', JSON.stringify(filtered));
  } catch {}
  return { success: true };
}

export async function fetchMedia(): Promise<MediaItem[]> {
  try {
    const res = await fetch(`${API_BASE}/media`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {}

  try {
    const cached = localStorage.getItem('gm_cached_media');
    if (cached) return JSON.parse(cached);
  } catch {}

  return INITIAL_MEDIA;
}

export async function createMediaApi(media: Partial<MediaItem>): Promise<MediaItem> {
  try {
    const res = await fetch(`${API_BASE}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(media)
    });
    if (res.ok) return await res.json();
  } catch {}

  const all = await fetchMedia();
  const newMedia: MediaItem = {
    id: 'med-' + Date.now(),
    title: media.title || 'Media Baru',
    type: media.type || 'image',
    url: media.url || '/images/ps4.jpg',
    category: media.category || 'product',
    createdAt: new Date().toISOString()
  };
  all.unshift(newMedia);
  try {
    localStorage.setItem('gm_cached_media', JSON.stringify(all));
  } catch {}
  return newMedia;
}

export async function deleteMediaApi(id: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/media/${id}`, { method: 'DELETE' });
    if (res.ok) return await res.json();
  } catch {}

  const all = await fetchMedia();
  const filtered = all.filter(m => m.id !== id);
  try {
    localStorage.setItem('gm_cached_media', JSON.stringify(filtered));
  } catch {}
  return { success: true };
}

export async function fetchSettings(): Promise<WebsiteSettings> {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.businessName) return data;
    }
  } catch {}

  try {
    const cached = localStorage.getItem('gm_cached_settings');
    if (cached) return JSON.parse(cached);
  } catch {}

  return INITIAL_SETTINGS;
}

export async function updateSettingsApi(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
  try {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (res.ok) return await res.json();
  } catch {}

  const current = await fetchSettings();
  const updated = { ...current, ...settings };
  try {
    localStorage.setItem('gm_cached_settings', JSON.stringify(updated));
  } catch {}
  return updated;
}

export async function fetchStats(): Promise<AdminStats> {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    if (res.ok) return await res.json();
  } catch {}

  const bookings = await fetchBookings();
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const bookingsToday = bookings.filter(b => b.createdAt.startsWith(todayStr)).length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const activeBookings = bookings.filter(b => b.status === 'On Rental').length;
  const completedBookings = bookings.filter(b => b.status === 'Completed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelled').length;

  const estimatedRevenue = bookings
    .filter(b => b.status !== 'Cancelled')
    .reduce((acc, b) => acc + (b.price || 0), 0);

  const dailyRevenue = bookings
    .filter(b => b.status !== 'Cancelled' && b.createdAt.startsWith(todayStr))
    .reduce((acc, b) => acc + (b.price || 0), 0);

  return {
    totalBookings: bookings.length,
    bookingsToday,
    pendingBookings,
    activeBookings,
    completedBookings,
    cancelledBookings,
    estimatedRevenue,
    dailyRevenue,
    recentBookings: bookings.slice(0, 5)
  };
}

export const fetchAdminStats = fetchStats;
export const createMediaItemApi = createMediaApi;
export const deleteMediaItemApi = deleteMediaApi;

export async function loginAdminApi(username: string, password: string): Promise<{
  success: boolean;
  token: string;
  user: { id: string; username: string; name: string };
}> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) return await res.json();
  } catch {}

  // Fallback credentials for static deployment preview
  if (username.toLowerCase() === 'admin' && password === 'gamemaster2026') {
    const user = { id: 'usr-admin-1', username: 'admin', name: 'Super Admin Game Master' };
    const token = 'gm_admin_' + btoa('admin:' + Date.now());
    return { success: true, token, user };
  }

  throw new Error('Username atau password salah');
}
