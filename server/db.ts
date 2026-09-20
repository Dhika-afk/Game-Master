import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  Product,
  ProductPrice,
  Booking,
  HeroVideo,
  CustomerReview,
  MediaItem,
  WebsiteSettings,
  AdminStats
} from '../src/types.js';
import {
  initialProducts,
  initialProductPrices,
  initialHeroVideos,
  initialReviews,
  initialSettings,
  initialMedia
} from './defaultData.js';

interface AdminUserRecord {
  id: string;
  username: string;
  passwordHash: string;
  salt: string;
  name: string;
}

interface DatabaseSchema {
  users: AdminUserRecord[];
  products: Product[];
  product_prices: ProductPrice[];
  bookings: Booking[];
  reviews: CustomerReview[];
  hero_videos: HeroVideo[];
  media: MediaItem[];
  settings: WebsiteSettings;
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Helper to hash password
export function hashPassword(password: string, salt: string): string {
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

class DatabaseService {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure all top-level collections exist
        return {
          users: parsed.users || this.getDefaultUsers(),
          products: parsed.products || initialProducts,
          product_prices: parsed.product_prices || initialProductPrices,
          bookings: parsed.bookings || this.getDefaultBookings(),
          reviews: parsed.reviews || initialReviews,
          hero_videos: parsed.hero_videos || initialHeroVideos,
          media: parsed.media || initialMedia,
          settings: parsed.settings || initialSettings
        };
      } catch (err) {
        console.error('Error reading db.json, re-initializing default state:', err);
      }
    }

    const defaultState: DatabaseSchema = {
      users: this.getDefaultUsers(),
      products: initialProducts,
      product_prices: initialProductPrices,
      bookings: this.getDefaultBookings(),
      reviews: initialReviews,
      hero_videos: initialHeroVideos,
      media: initialMedia,
      settings: initialSettings
    };
    this.saveData(defaultState);
    return defaultState;
  }

  private saveData(dataToSave: DatabaseSchema = this.data) {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write db.json:', err);
    }
  }

  private getDefaultUsers(): AdminUserRecord[] {
    const salt = 'gamemaster_salt_2026';
    return [
      {
        id: 'usr-admin-1',
        username: 'admin',
        passwordHash: hashPassword('gamemaster2026', salt),
        salt: salt,
        name: 'Super Admin Game Master'
      }
    ];
  }

  private getDefaultBookings(): Booking[] {
    return [
      {
        id: 'bk-sample-1',
        bookingId: 'GM-20260918-001',
        customerName: 'Muhammad Aditya',
        customerPhone: '081912345678',
        customerAddress: 'Jl. Pemuda No. 12, Mataram',
        productId: 'prod-ps4',
        productName: 'PS4',
        duration: '2 Hari',
        price: 180000,
        startDate: '2026-09-18',
        endDate: '2026-09-20',
        notes: 'Minta stick warna hitam dan game FIFA 24',
        status: 'Completed',
        createdAt: '2026-09-18T10:00:00.000Z',
        adminNotes: 'Selesai disewa dan unit dikembalikan dengan kondisi mulus'
      },
      {
        id: 'bk-sample-2',
        bookingId: 'GM-20260919-002',
        customerName: 'Kadek Surya',
        customerPhone: '085987654321',
        customerAddress: 'Jl. Caturwarga Gg. Dahlia No. 4, Mataram',
        productId: 'prod-ps4-tv',
        productName: 'PS4 + TV',
        duration: '3 Hari',
        price: 350000,
        startDate: '2026-09-19',
        endDate: '2026-09-22',
        notes: 'Antar setelah maghrib ya mas',
        status: 'On Rental',
        createdAt: '2026-09-19T14:30:00.000Z',
        adminNotes: 'Unit aktif disewa di lokasi pelanggan'
      },
      {
        id: 'bk-sample-3',
        bookingId: 'GM-20260920-003',
        customerName: 'Nadia Safitri',
        customerPhone: '087766554433',
        customerAddress: 'Perumahan Riverside Kekalik No. A8, Mataram',
        productId: 'prod-switch',
        productName: 'Nintendo Switch',
        duration: '1 Hari',
        price: 110000,
        startDate: '2026-09-20',
        endDate: '2026-09-21',
        notes: 'Tolong pastikan game Mario Kart terinstall',
        status: 'Pending',
        createdAt: '2026-09-20T08:15:00.000Z',
        adminNotes: ''
      }
    ];
  }

  // --- Auth ---
  verifyAdmin(username: string, passwordPlain: string): { success: boolean; user?: { id: string; username: string; name: string } } {
    const user = this.data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
      return { success: false };
    }
    const hash = hashPassword(passwordPlain, user.salt);
    if (hash === user.passwordHash) {
      return {
        success: true,
        user: { id: user.id, username: user.username, name: user.name }
      };
    }
    return { success: false };
  }

  // --- Products & Prices ---
  getProducts(): Product[] {
    // Attach prices to each product
    return this.data.products
      .map(p => {
        const prices = this.data.product_prices
          .filter(pr => pr.productId === p.id)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        return {
          ...p,
          prices
        };
      })
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  getProductById(id: string): Product | null {
    const product = this.data.products.find(p => p.id === id || p.slug === id);
    if (!product) return null;
    const prices = this.data.product_prices
      .filter(pr => pr.productId === product.id)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    return { ...product, prices };
  }

  createProduct(product: Omit<Product, 'id'>): Product {
    const id = 'prod-' + Date.now();
    const newProduct: Product = {
      ...product,
      id,
      slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sortOrder: product.sortOrder || this.data.products.length + 1
    };
    this.data.products.push(newProduct);
    this.saveData();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.saveData();
    return this.getProductById(id);
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    // Also remove prices
    this.data.product_prices = this.data.product_prices.filter(pr => pr.productId !== id);
    this.saveData();
    return this.data.products.length < initialLen;
  }

  // --- Prices CMS ---
  getAllPrices(): ProductPrice[] {
    return this.data.product_prices.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  createPrice(priceData: Omit<ProductPrice, 'id'>): ProductPrice {
    const id = 'pr-' + Date.now();
    const newPrice: ProductPrice = {
      ...priceData,
      id,
      sortOrder: priceData.sortOrder || 1
    };
    this.data.product_prices.push(newPrice);
    this.saveData();
    return newPrice;
  }

  updatePrice(id: string, updates: Partial<ProductPrice>): ProductPrice | null {
    const idx = this.data.product_prices.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.product_prices[idx] = { ...this.data.product_prices[idx], ...updates };
    this.saveData();
    return this.data.product_prices[idx];
  }

  deletePrice(id: string): boolean {
    const initialLen = this.data.product_prices.length;
    this.data.product_prices = this.data.product_prices.filter(p => p.id !== id);
    this.saveData();
    return this.data.product_prices.length < initialLen;
  }

  // --- Bookings ---
  getBookings(): Booking[] {
    return this.data.bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getBookingById(idOrBookingId: string): Booking | null {
    return this.data.bookings.find(
      b => b.id === idOrBookingId || b.bookingId.toLowerCase() === idOrBookingId.toLowerCase()
    ) || null;
  }

  createBooking(bookingInput: {
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
  }): Booking {
    // Generate Booking ID format: GM-YYYYMMDD-XXX
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const todayPrefix = `GM-${yyyy}${mm}${dd}`;

    const countToday = this.data.bookings.filter(b => b.bookingId.startsWith(todayPrefix)).length + 1;
    const bookingId = `${todayPrefix}-${String(countToday).padStart(3, '0')}`;

    const newBooking: Booking = {
      id: 'bk-' + Date.now(),
      bookingId,
      customerName: bookingInput.customerName,
      customerPhone: bookingInput.customerPhone,
      customerAddress: bookingInput.customerAddress,
      productId: bookingInput.productId,
      productName: bookingInput.productName,
      duration: bookingInput.duration,
      price: Number(bookingInput.price) || 0,
      startDate: bookingInput.startDate,
      endDate: bookingInput.endDate,
      notes: bookingInput.notes || '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      adminNotes: ''
    };

    this.data.bookings.unshift(newBooking);
    this.saveData();
    return newBooking;
  }

  updateBookingStatus(id: string, status: Booking['status'], adminNotes?: string): Booking | null {
    const booking = this.data.bookings.find(b => b.id === id || b.bookingId === id);
    if (!booking) return null;
    booking.status = status;
    if (adminNotes !== undefined) {
      booking.adminNotes = adminNotes;
    }
    this.saveData();
    return booking;
  }

  deleteBooking(id: string): boolean {
    const initialLen = this.data.bookings.length;
    this.data.bookings = this.data.bookings.filter(b => b.id !== id && b.bookingId !== id);
    this.saveData();
    return this.data.bookings.length < initialLen;
  }

  // --- Hero Videos ---
  getHeroVideos(): HeroVideo[] {
    return this.data.hero_videos.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  createHeroVideo(video: Omit<HeroVideo, 'id'>): HeroVideo {
    const id = 'vid-' + Date.now();
    const newVideo: HeroVideo = {
      ...video,
      id,
      sortOrder: video.sortOrder || this.data.hero_videos.length + 1
    };
    this.data.hero_videos.push(newVideo);
    this.saveData();
    return newVideo;
  }

  updateHeroVideo(id: string, updates: Partial<HeroVideo>): HeroVideo | null {
    const idx = this.data.hero_videos.findIndex(v => v.id === id);
    if (idx === -1) return null;
    this.data.hero_videos[idx] = { ...this.data.hero_videos[idx], ...updates };
    this.saveData();
    return this.data.hero_videos[idx];
  }

  deleteHeroVideo(id: string): boolean {
    const initialLen = this.data.hero_videos.length;
    this.data.hero_videos = this.data.hero_videos.filter(v => v.id !== id);
    this.saveData();
    return this.data.hero_videos.length < initialLen;
  }

  // --- Reviews ---
  getReviews(): CustomerReview[] {
    return this.data.reviews;
  }

  createReview(review: Omit<CustomerReview, 'id' | 'date'>): CustomerReview {
    const id = 'rev-' + Date.now();
    const newReview: CustomerReview = {
      ...review,
      id,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    this.data.reviews.unshift(newReview);
    this.saveData();
    return newReview;
  }

  updateReview(id: string, updates: Partial<CustomerReview>): CustomerReview | null {
    const idx = this.data.reviews.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.data.reviews[idx] = { ...this.data.reviews[idx], ...updates };
    this.saveData();
    return this.data.reviews[idx];
  }

  deleteReview(id: string): boolean {
    const initialLen = this.data.reviews.length;
    this.data.reviews = this.data.reviews.filter(r => r.id !== id);
    this.saveData();
    return this.data.reviews.length < initialLen;
  }

  // --- Media ---
  getMedia(): MediaItem[] {
    return this.data.media;
  }

  createMediaItem(item: Omit<MediaItem, 'id' | 'createdAt'>): MediaItem {
    const id = 'med-' + Date.now();
    const newMedia: MediaItem = {
      ...item,
      id,
      createdAt: new Date().toISOString()
    };
    this.data.media.unshift(newMedia);
    this.saveData();
    return newMedia;
  }

  deleteMediaItem(id: string): boolean {
    const initialLen = this.data.media.length;
    this.data.media = this.data.media.filter(m => m.id !== id);
    this.saveData();
    return this.data.media.length < initialLen;
  }

  // --- Settings ---
  getSettings(): WebsiteSettings {
    return this.data.settings;
  }

  updateSettings(updates: Partial<WebsiteSettings>): WebsiteSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.saveData();
    return this.data.settings;
  }

  // --- Admin Stats ---
  getStats(): AdminStats {
    const bookings = this.data.bookings;
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
}

export const db = new DatabaseService();
