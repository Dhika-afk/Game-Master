-- ==========================================================
-- SKEMA DATABASE SUPABASE: RENTAL PLAYSTATION (GAME MASTER)
-- ==========================================================
-- Jalankan seluruh script SQL ini di Supabase Dashboard -> SQL Editor -> New Query -> Run.

-- 1. Aktifkan ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================================
-- 2. TABEL: products
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  price_unit TEXT NOT NULL DEFAULT 'per hari',
  image TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  badge TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance')),
  stock INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index untuk performa query katalog
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON public.products(sort_order);

-- ==========================================================
-- 3. TABEL: orders
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration INTEGER NOT NULL DEFAULT 1,
  total_price NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'ongoing', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index untuk performa query pesanan
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON public.orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ==========================================================
-- 4. ROW LEVEL SECURITY (RLS) & POLICIES
-- ==========================================================
-- Aktifkan RLS pada kedua tabel
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy untuk products:
-- Siapapun dapat membaca produk (katalog publik)
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products"
  ON public.products FOR SELECT
  USING (true);

-- Admin / Anon Key dapat menambah produk baru
DROP POLICY IF EXISTS "Allow insert products" ON public.products;
CREATE POLICY "Allow insert products"
  ON public.products FOR INSERT
  WITH CHECK (true);

-- Admin / Anon Key dapat mengubah produk
DROP POLICY IF EXISTS "Allow update products" ON public.products;
CREATE POLICY "Allow update products"
  ON public.products FOR UPDATE
  USING (true);

-- Admin / Anon Key dapat menghapus produk
DROP POLICY IF EXISTS "Allow delete products" ON public.products;
CREATE POLICY "Allow delete products"
  ON public.products FOR DELETE
  USING (true);

-- Policy untuk orders:
-- Siapapun (pengunjung yang booking) dapat membuat pesanan baru
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Admin dapat melihat seluruh daftar pesanan
DROP POLICY IF EXISTS "Allow select orders" ON public.orders;
CREATE POLICY "Allow select orders"
  ON public.orders FOR SELECT
  USING (true);

-- Admin dapat memperbarui status pesanan
DROP POLICY IF EXISTS "Allow update orders" ON public.orders;
CREATE POLICY "Allow update orders"
  ON public.orders FOR UPDATE
  USING (true);

-- Admin dapat menghapus pesanan
DROP POLICY IF EXISTS "Allow delete orders" ON public.orders;
CREATE POLICY "Allow delete orders"
  ON public.orders FOR DELETE
  USING (true);

-- ==========================================================
-- 5. SETUP SUPABASE STORAGE: BUCKET 'product-images'
-- ==========================================================
-- Buat bucket penyimpanan gambar produk jika belum ada
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policy: Siapapun dapat melihat gambar produk (Publik)
DROP POLICY IF EXISTS "Public Access Product Images" ON storage.objects;
CREATE POLICY "Public Access Product Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Storage Policy: Izinkan upload file ke bucket product-images
DROP POLICY IF EXISTS "Allow Upload Product Images" ON storage.objects;
CREATE POLICY "Allow Upload Product Images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

-- Storage Policy: Izinkan update/replace file gambar
DROP POLICY IF EXISTS "Allow Update Product Images" ON storage.objects;
CREATE POLICY "Allow Update Product Images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images');

-- Storage Policy: Izinkan hapus gambar dari bucket
DROP POLICY IF EXISTS "Allow Delete Product Images" ON storage.objects;
CREATE POLICY "Allow Delete Product Images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');

-- ==========================================================
-- 6. DATA AWAL (SEED PRODUCTS)
-- ==========================================================
-- Masukkan unit rental awal jika tabel masih kosong
INSERT INTO public.products (
  name,
  category,
  price,
  price_unit,
  image,
  description,
  short_description,
  badge,
  sort_order,
  status,
  stock
)
VALUES
  (
    'PlayStation 4 Slim',
    'PS4',
    90000,
    'per hari',
    '/images/ps4.jpg',
    'Paket rental PlayStation 4 Slim siap main. Sudah termasuk 2 stick wireless original Sony DualShock 4, kabel HDMI high speed, kabel power, charger stick, dan puluhan game terupdate seperti eFootball, FIFA, GTA V, Naruto, God of War, dll.',
    'Paket rental console PS4 Slim lengkap 2 stick wireless dan puluhan game terupdate.',
    'TERPOPULER',
    1,
    'available',
    5
  ),
  (
    'Paket PS4 + TV LED 32 Inch',
    'PS4 + TV',
    130000,
    'per hari',
    '/images/ps4-tv.jpg',
    'Paket komplit gaming tanpa repot! Sudah termasuk 1 unit PS4 Slim, 2 stick wireless, 1 unit TV LED 32 Inch HD jernih, kabel lengkap dan game siap main. Sangat cocok untuk kos, kontrakan, hotel, atau acara kumpul teman.',
    'Solusi komplit console PS4 + TV LED 32 Inch, siap main langsung tanpa repot.',
    'PAKET HEMAT',
    2,
    'available',
    3
  ),
  (
    'PlayStation 4 BOX Exclusive',
    'PS4 BOX',
    100000,
    'per hari',
    '/images/ps4-box.jpg',
    'Paket rental PS4 dengan hardcase box pelindung premium. Aman untuk dibawa bepergian, villa, atau staycation. Lengkap 2 stik wireless dan aksesoris original.',
    'Paket rental PS4 dengan box hardcase premium, praktis dan aman dibawa ke mana saja.',
    'PORTABLE BOX',
    3,
    'available',
    2
  ),
  (
    'PlayStation 3 Super Slim',
    'PS3',
    50000,
    'per hari',
    '/images/ps3.jpg',
    'Paket rental PlayStation 3 ekonomis dengan performa handal. Dilengkapi 2 stick wireless dan ratusan pilihan game legendaris seperti PES terupdate, GTA V, Resident Evil, dll.',
    'Rental PS3 murah dan seru, hemat budget dengan ratusan game seru.',
    'BEST VALUE',
    4,
    'available',
    4
  ),
  (
    'Paket PS3 + TV LED 32 Inch',
    'PS3 + TV',
    90000,
    'per hari',
    '/images/ps3-tv.jpg',
    'Paket lengkap PS3 dipadukan dengan TV LED 32 Inch berkualitas tajam. Tinggal colok listrik dan langsung seru-seruan bareng teman.',
    'Paket lengkap hemat PlayStation 3 dan TV 32 inch siap main kapan saja.',
    'KOMPLIT HEMAT',
    5,
    'available',
    2
  ),
  (
    'PlayStation 3 BOX',
    'PS3 BOX',
    60000,
    'per hari',
    '/images/ps3-box.jpg',
    'Paket rental PS3 dengan box khusus yang rapi dan mudah dibawa.',
    'PS3 dalam box praktis untuk kebutuhan rental harian dan mingguan.',
    'BOX SET',
    6,
    'available',
    2
  ),
  (
    'Nintendo Switch V2 / OLED',
    'Nintendo Switch',
    120000,
    'per hari',
    '/images/switch.jpg',
    'Rental konsol hybrid Nintendo Switch. Bisa dimainkan portable di mana saja atau disambungkan ke TV rumah. Termasuk dock TV, charger original, grip, dan game favorit (Mario Kart 8, Zelda, Smash Bros, Pokemon).',
    'Konsol hybrid seru, bisa main di TV atau mode handheld kapan saja.',
    'UNIT FAVORIT',
    7,
    'available',
    3
  ),
  (
    'Nintendo Switch Lite',
    'Nintendo Switch Lite',
    75000,
    'per hari',
    '/images/switch-lite.jpg',
    'Konsol murni handheld yang ringan dan praktis untuk gaming santai di kos atau perjalanan liburan.',
    'Ringan, praktis, dan hemat daya untuk bermain game Nintendo di mana saja.',
    'PORTABLE',
    8,
    'available',
    2
  ),
  (
    'PlayStation 2 Nostalgia Flashdisk',
    'PS2',
    35000,
    'per hari',
    '/images/ps2.jpg',
    'Nostalgia era keemasan game PS2! Menggunakan flashdisk full ratusan game tanpa loading kaset lelet (Downhill, GTA San Andreas, Winning Eleven, Basara, Guitar Hero).',
    'Paket rental nostalgia PS2 Flashdisk full game legendaris favorit masa kecil.',
    'NOSTALGIA',
    9,
    'available',
    3
  ),
  (
    'TV LED 32 Inch Tambahan',
    'TV 32 INCH',
    50000,
    'per hari',
    '/images/tv-32.jpg',
    'Sewa TV LED 32 Inch berkualitas HD dengan port HDMI untuk mendukung sesi gaming kamu atau monitor tambahan.',
    'Unit TV LED 32 Inch jernih dan tajam dengan kabel HDMI siap pakai.',
    'ADD-ON UNIT',
    10,
    'available',
    3
  )
ON CONFLICT (id) DO NOTHING;
