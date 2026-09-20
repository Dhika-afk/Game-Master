import { Product, ProductPrice, HeroVideo, CustomerReview, WebsiteSettings, MediaItem } from '../src/types.js';

export const initialProducts: Product[] = [
  {
    id: 'prod-ps4',
    slug: 'ps4',
    name: 'PS4',
    category: 'PS4',
    shortDesc: 'PlayStation 4 Rental Original & Terawat',
    description: 'Unit PlayStation 4 Slim performa maksimal dengan pendingin optimal. Sudah dilengkapi game-game terpopuler terbaru seperti eFootball / FC 24, GTA V, God of War, Mortal Kombat 11, dan game multiplayer seru.',
    badge: 'Paling Populer',
    mainImage: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507457379470-08b800bebc67?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?auto=format&fit=crop&w=1000&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=400&q=80',
    includedItems: [
      '1x Console PlayStation 4 Slim',
      '2x Stick DualShock 4 Wireless Original',
      '1x Kabel HDMI High Speed',
      '1x Kabel Power AC & Kabel Charger Stick',
      'Full Game Terinstall & Siap Main'
    ],
    features: [
      'Rental PlayStation',
      'Antar–jemput',
      'Wilayah Mataram dan sekitarnya',
      'Peralatan lengkap'
    ],
    isPopular: true,
    isActive: true,
    sortOrder: 1
  },
  {
    id: 'prod-ps4-tv',
    slug: 'ps4-tv',
    name: 'PS4 + TV',
    category: 'PS4 + TV',
    shortDesc: 'Paket Komplit PS4 + TV LED 32 Inch Siap Main',
    description: 'Solusi lengkap anti ribet untuk kosan, villa, atau rumah tanpa TV. Dapat 1 unit PS4 beserta TV LED 32 inch gambar jernih HD, kabel lengkap, tinggal colok dan main bersama teman.',
    badge: 'Paket Hemat',
    mainImage: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=400&q=80',
    includedItems: [
      '1x Console PlayStation 4 Slim',
      '1x TV LED 32 Inch Crystal Clear HD',
      '2x Stick DualShock 4 Wireless Original',
      'Kabel HDMI & Semua Kabel Konektor Lengkap',
      'Standing TV & Remote TV'
    ],
    features: [
      'Rental PlayStation + TV 32"',
      'Antar–jemput ke Lokasi',
      'Wilayah Mataram dan sekitarnya',
      'Peralatan lengkap tinggal main'
    ],
    isPopular: true,
    isActive: true,
    sortOrder: 2
  },
  {
    id: 'prod-ps4-box',
    slug: 'ps4-box',
    name: 'PS4 BOX',
    category: 'PS4 BOX',
    shortDesc: 'PlayStation 4 Hardcase Box Travel Edition',
    description: 'Paket rental PS4 dengan hardcase box protektif premium. Sangat praktis dan aman untuk dibawa bepergian, gathering, camping, atau acara kantor di Mataram & Lombok.',
    badge: 'Travel Edition',
    mainImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
    includedItems: [
      '1x Hardcase Box Eksklusif & Busa Pelindung',
      '1x Console PlayStation 4',
      '2x Stick Wireless Original',
      'Kabel HDMI & Power Kabel',
      'Koleksi Game Terupdate'
    ],
    features: [
      'Rental PlayStation Box',
      'Hardcase Aman & Praktis',
      'Antar–jemput Mataram',
      'Peralatan lengkap'
    ],
    isPopular: false,
    isActive: true,
    sortOrder: 3
  },
  {
    id: 'prod-ps3',
    slug: 'ps3',
    name: 'PS3',
    category: 'PS3',
    shortDesc: 'PlayStation 3 Rental Murah & Penuh Game',
    description: 'Pilihan sewa paling terjangkau dengan ratusan game seru! Cocok untuk seru-seruan bareng teman kosan dengan game ikonik seperti PES, GTA San Andreas, Need for Speed, Naruto Shippuden, dan Tekken.',
    badge: 'Best Value',
    mainImage: 'https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507457379470-08b800bebc67?auto=format&fit=crop&w=1000&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?auto=format&fit=crop&w=400&q=80',
    includedItems: [
      '1x Console PlayStation 3 Slim/Super Slim',
      '2x Stick Wireless DualShock 3',
      '1x Kabel HDMI & Kabel Power',
      '1x Kabel Charger Stick USB',
      'Pilihan 50+ Game Terinstall'
    ],
    features: [
      'Rental PlayStation 3',
      'Antar–jemput',
      'Wilayah Mataram dan sekitarnya',
      'Peralatan lengkap'
    ],
    isPopular: true,
    isActive: true,
    sortOrder: 4
  },
  {
    id: 'prod-ps3-tv',
    slug: 'ps3-tv',
    name: 'PS3 + TV',
    category: 'PS3 + TV',
    shortDesc: 'Paket Hemat PS3 + TV LED 32 Inch',
    description: 'Sewa PS3 komplit dengan TV LED 32 inch. Solusi gaming santai dan hemat di tempat tinggal Anda tanpa perlu pusing mencari layar TV.',
    badge: 'Hemat Banget',
    mainImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?auto=format&fit=crop&w=1000&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    includedItems: [
      '1x Console PS3 Slim',
      '1x TV LED 32 Inch HD',
      '2x Stick Wireless DualShock 3',
      'Kabel HDMI & Power Kabel',
      'Remote TV & Standing'
    ],
    features: [
      'Rental PS3 + TV 32"',
      'Antar–jemput',
      'Wilayah Mataram dan sekitarnya',
      'Peralatan lengkap'
    ],
    isPopular: false,
    isActive: true,
    sortOrder: 5
  },
  {
    id: 'prod-ps3-box',
    slug: 'ps3-box',
    name: 'PS3 BOX',
    category: 'PS3 BOX',
    shortDesc: 'PlayStation 3 Hardcase Box Portable',
    description: 'Unit PS3 dalam kemasan koper box pelindung tebal. Mudah dibawa mobile ke mana saja dengan perlindungan maksimal.',
    badge: 'Mobile Box',
    mainImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
    includedItems: [
      '1x Koper Box Khusus PS3',
      '1x Console PS3 Slim',
      '2x Stick Wireless',
      'Kabel HDMI & Power'
    ],
    features: [
      'Rental PS3 Box',
      'Antar–jemput',
      'Wilayah Mataram dan sekitarnya',
      'Peralatan lengkap'
    ],
    isPopular: false,
    isActive: true,
    sortOrder: 6
  },
  {
    id: 'prod-switch',
    slug: 'nintendo-switch',
    name: 'Nintendo Switch',
    category: 'Nintendo Switch',
    shortDesc: 'Nintendo Switch Hybrid Party Console',
    description: 'Konsol hybrid idaman! Bisa dimainkan secara portable handheld atau dihubungkan ke TV. Cocok sekali untuk mabar seru bareng teman atau keluarga dengan Mario Kart 8 Deluxe, Super Smash Bros, Zelda, dan Overcooked.',
    badge: 'Mabar Seru',
    mainImage: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1612287233215-66798c56641b?auto=format&fit=crop&w=1000&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=400&q=80',
    includedItems: [
      '1x Nintendo Switch Tablet Console',
      '1x Pasang Joy-Con (Left & Right)',
      '1x Joy-Con Grip & Wrist Straps',
      '1x Nintendo Switch TV Docking & HDMI',
      '1x AC Adapter Charger Original',
      'Game Seru Populer Pilihan'
    ],
    features: [
      'Rental Nintendo Switch',
      'Bisa Handheld & Sambung TV',
      'Antar–jemput Mataram',
      'Peralatan lengkap'
    ],
    isPopular: true,
    isActive: true,
    sortOrder: 7
  },
  {
    id: 'prod-switch-lite',
    slug: 'nintendo-switch-lite',
    name: 'Nintendo Switch Lite',
    category: 'Nintendo Switch Lite',
    shortDesc: 'Konsol Portable Ringan Praktis',
    description: 'Edisi ringkas dan ringan didesain khusus untuk permainan handheld personal. Baterai awet, nyaman digenggam saat rebahan di kamar atau perjalanan santai.',
    badge: 'Compact & Fun',
    mainImage: 'https://images.unsplash.com/photo-1612287233215-66798c56641b?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1612287233215-66798c56641b?auto=format&fit=crop&w=1000&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1612287233215-66798c56641b?auto=format&fit=crop&w=400&q=80',
    includedItems: [
      '1x Nintendo Switch Lite Unit',
      '1x AC Adapter Charger Cepat',
      '1x Hard Pouch Protective Case',
      'Game Terinstall Siap Main'
    ],
    features: [
      'Rental Nintendo Switch Lite',
      'Super Portable & Nyaman',
      'Antar–jemput Mataram',
      'Peralatan lengkap'
    ],
    isPopular: false,
    isActive: true,
    sortOrder: 8
  },
  {
    id: 'prod-ps2',
    slug: 'ps2',
    name: 'PS2',
    category: 'PS2',
    shortDesc: 'PlayStation 2 Nostalgia Legend',
    description: 'Kembali ke masa kejayaan game klasik rental dengan PlayStation 2. Ratusan game legendaris masa kecil seperti GTA San Andreas, Winning Eleven, Downhill Domination, Basara, Guitar Hero, dan Bully.',
    badge: 'Nostalgia Legend',
    mainImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
    includedItems: [
      '1x Console PlayStation 2 Slim',
      '2x Stick PS2 Analog',
      '1x Kabel AV / HDMI Converter',
      '1x Adaptor Power',
      '1x Flashdisk / HDD Ratusan Game Nostalgia'
    ],
    features: [
      'Rental PlayStation 2 Nostalgia',
      'Antar–jemput Mataram',
      'Ratusan game klasik nostalgia',
      'Peralatan lengkap'
    ],
    isPopular: false,
    isActive: true,
    sortOrder: 9
  },
  {
    id: 'prod-tv32',
    slug: 'tv-32-inch',
    name: 'TV 32 INCH',
    category: 'TV 32 INCH',
    shortDesc: 'TV LED 32 Inch HD Crystal Clear',
    description: 'Sewa TV LED 32 Inch jernih dengan port HDMI lengkap, refresh rate responsif untuk gaming, speaker stereo mantap, dan kaki standing kokoh.',
    badge: 'Unit Jernih',
    mainImage: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1000&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=400&q=80',
    includedItems: [
      '1x TV LED 32 Inch HD',
      '1x Remote Control + Baterai',
      '1x Kabel HDMI High Speed',
      '1x Kabel Power AC',
      'Standing Kaki TV Kokoh'
    ],
    features: [
      'Sewa TV 32 Inch Gaming',
      'Antar–jemput',
      'Wilayah Mataram dan sekitarnya',
      'Peralatan lengkap'
    ],
    isPopular: false,
    isActive: true,
    sortOrder: 10
  }
];

export const initialProductPrices: ProductPrice[] = [
  // PS4
  { id: 'pr-ps4-1d', productId: 'prod-ps4', duration: '1 Hari', price: 110000, label: 'Mulai dari', sortOrder: 1 },
  { id: 'pr-ps4-2d', productId: 'prod-ps4', duration: '2 Hari', price: 180000, label: 'Hemat Rp40.000', sortOrder: 2 },
  { id: 'pr-ps4-3d', productId: 'prod-ps4', duration: '3 Hari', price: 250000, label: 'Paling Populer', sortOrder: 3 },
  { id: 'pr-ps4-4d', productId: 'prod-ps4', duration: '4 Hari', price: 320000, sortOrder: 4 },
  { id: 'pr-ps4-1w', productId: 'prod-ps4', duration: '1 Minggu', price: 500000, label: 'Super Hemat Mingguan', sortOrder: 5 },

  // PS4 + TV
  { id: 'pr-ps4tv-1d', productId: 'prod-ps4-tv', duration: '1 Hari', price: 160000, sortOrder: 1 },
  { id: 'pr-ps4tv-2d', productId: 'prod-ps4-tv', duration: '2 Hari', price: 280000, sortOrder: 2 },
  { id: 'pr-ps4tv-3d', productId: 'prod-ps4-tv', duration: '3 Hari', price: 350000, label: 'Rekomendasi Mabar', sortOrder: 3 },
  { id: 'pr-ps4tv-4d', productId: 'prod-ps4-tv', duration: '4 Hari', price: 400000, sortOrder: 4 },
  { id: 'pr-ps4tv-1w', productId: 'prod-ps4-tv', duration: '1 Minggu', price: 650000, label: 'Paket Mingguan', sortOrder: 5 },

  // PS4 BOX
  { id: 'pr-ps4box-1d', productId: 'prod-ps4-box', duration: '1 Hari', price: 180000, sortOrder: 1 },
  { id: 'pr-ps4box-2d', productId: 'prod-ps4-box', duration: '2 Hari', price: 300000, sortOrder: 2 },
  { id: 'pr-ps4box-3d', productId: 'prod-ps4-box', duration: '3 Hari', price: 400000, sortOrder: 3 },
  { id: 'pr-ps4box-4d', productId: 'prod-ps4-box', duration: '4 Hari', price: 480000, sortOrder: 4 },
  { id: 'pr-ps4box-1w', productId: 'prod-ps4-box', duration: '1 Minggu', price: 750000, sortOrder: 5 },

  // PS3
  { id: 'pr-ps3-1d', productId: 'prod-ps3', duration: '1 Hari', price: 55000, label: 'Termurah', sortOrder: 1 },
  { id: 'pr-ps3-2d', productId: 'prod-ps3', duration: '2 Hari', price: 100000, sortOrder: 2 },
  { id: 'pr-ps3-3d', productId: 'prod-ps3', duration: '3 Hari', price: 110000, label: 'Promo 3 Hari', sortOrder: 3 },
  { id: 'pr-ps3-1w', productId: 'prod-ps3', duration: '1 Minggu', price: 250000, label: 'Paket Mingguan', sortOrder: 4 },

  // PS3 + TV
  { id: 'pr-ps3tv-1d', productId: 'prod-ps3-tv', duration: '1 Hari', price: 110000, sortOrder: 1 },
  { id: 'pr-ps3tv-2d', productId: 'prod-ps3-tv', duration: '2 Hari', price: 180000, sortOrder: 2 },
  { id: 'pr-ps3tv-3d', productId: 'prod-ps3-tv', duration: '3 Hari', price: 250000, sortOrder: 3 },
  { id: 'pr-ps3tv-1w', productId: 'prod-ps3-tv', duration: '1 Minggu', price: 450000, sortOrder: 4 },

  // PS3 BOX
  { id: 'pr-ps3box-1d', productId: 'prod-ps3-box', duration: '1 Hari', price: 130000, sortOrder: 1 },
  { id: 'pr-ps3box-2d', productId: 'prod-ps3-box', duration: '2 Hari', price: 230000, sortOrder: 2 },
  { id: 'pr-ps3box-3d', productId: 'prod-ps3-box', duration: '3 Hari', price: 300000, sortOrder: 3 },
  { id: 'pr-ps3box-1w', productId: 'prod-ps3-box', duration: '1 Minggu', price: 550000, sortOrder: 4 },

  // NINTENDO SWITCH
  { id: 'pr-switch-1d', productId: 'prod-switch', duration: '1 Hari', price: 110000, sortOrder: 1 },
  { id: 'pr-switch-2d', productId: 'prod-switch', duration: '2 Hari', price: 180000, sortOrder: 2 },
  { id: 'pr-switch-3d', productId: 'prod-switch', duration: '3 Hari', price: 250000, label: 'Favorit Weekend', sortOrder: 3 },
  { id: 'pr-switch-1w', productId: 'prod-switch', duration: '1 Minggu', price: 500000, sortOrder: 4 },

  // NINTENDO SWITCH LITE
  { id: 'pr-switchlite-1d', productId: 'prod-switch-lite', duration: '1 Hari', price: 55000, sortOrder: 1 },
  { id: 'pr-switchlite-2d', productId: 'prod-switch-lite', duration: '2 Hari', price: 100000, sortOrder: 2 },
  { id: 'pr-switchlite-3d', productId: 'prod-switch-lite', duration: '3 Hari', price: 110000, sortOrder: 3 },
  { id: 'pr-switchlite-1w', productId: 'prod-switch-lite', duration: '1 Minggu', price: 250000, sortOrder: 4 },

  // PS2
  { id: 'pr-ps2-min2d', productId: 'prod-ps2', duration: 'Minimal 2 Hari', price: 60000, label: 'Min. 2 Hari', sortOrder: 1 },
  { id: 'pr-ps2-1w', productId: 'prod-ps2', duration: '1 Minggu', price: 150000, sortOrder: 2 },
  { id: 'pr-ps2-tv-1d', productId: 'prod-ps2', duration: 'PS2 + TV 1 Hari', price: 80000, label: 'Paket + TV', sortOrder: 3 },

  // TV 32 INCH
  { id: 'pr-tv-min2d', productId: 'prod-tv32', duration: 'Minimal 2 Hari', price: 110000, label: 'Min. 2 Hari', sortOrder: 1 },
  { id: 'pr-tv-1w', productId: 'prod-tv32', duration: '1 Minggu', price: 250000, sortOrder: 2 }
];

export const initialHeroVideos: HeroVideo[] = [
  {
    id: 'hero-vid-1',
    title: 'PlayStation & Next-Gen Gaming',
    subtitle: 'Main Seru, Tinggal Booking.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-playing-a-video-game-with-a-controller-41975-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1600&q=80',
    isActive: true,
    sortOrder: 1
  },
  {
    id: 'hero-vid-2',
    title: 'Setup Rental Komplit & Siap Antar',
    subtitle: 'Layanan Rental PlayStation Terpercaya di Mataram & Sekitarnya',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-gamer-playing-video-games-with-a-headset-41974-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
    isActive: true,
    sortOrder: 2
  },
  {
    id: 'hero-vid-3',
    title: 'Party Games & Mabar Nintendo Switch',
    subtitle: 'Koleksi Game Lengkap Untuk Semua Momen Seru',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-friends-playing-a-video-game-in-the-living-room-41976-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1600&q=80',
    isActive: true,
    sortOrder: 3
  }
];

export const initialReviews: CustomerReview[] = [
  {
    id: 'rev-1',
    customerName: 'Rizky Pratama',
    customerPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'PS-nya bersih, controller lengkap dan proses booking cepat. Diantar tepat waktu ke kosan di Gomong. Stick original empuk!',
    date: '18 September 2026',
    location: 'Gomong, Mataram',
    isVerified: true,
    isApproved: true,
    showOnHomepage: true
  },
  {
    id: 'rev-2',
    customerName: 'Dimas Setiawan',
    customerPhoto: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Sewa paket PS4 + TV 32 inch buat malam mingguan bareng teman. Praktis tinggal colok kabel, gambarnya jernih dan game bolanya update.',
    date: '15 September 2026',
    location: 'Cakranegara, Mataram',
    isVerified: true,
    isApproved: true,
    showOnHomepage: true
  },
  {
    id: 'rev-3',
    customerName: 'Sarah Amalia',
    customerPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Nintendo Switch-nya mulus seperti baru! Mario Kart sama Overcooked seru banget buat mabar sama keluarga. Admin ramah dan fast respon.',
    date: '12 September 2026',
    location: 'Ampenan, Mataram',
    isVerified: true,
    isApproved: true,
    showOnHomepage: true
  },
  {
    id: 'rev-4',
    customerName: 'Hendra Gunawan',
    customerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Langganan setia tiap libur semester. Sewa seminggu harganya hemat parah. Unit tidak pernah overheat sama sekali. Mantap Game Master!',
    date: '8 September 2026',
    location: 'Mataram Barat',
    isVerified: true,
    isApproved: true,
    showOnHomepage: true
  },
  {
    id: 'rev-5',
    customerName: 'Fauzi Rahman',
    customerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Booking via website gampang banget, langsung terkoneksi ke WhatsApp admin. Kurirnya tepat janji pas jemput unit. 10/10 service!',
    date: '3 September 2026',
    location: 'Kekalik, Mataram',
    isVerified: true,
    isApproved: true,
    showOnHomepage: true
  },
  {
    id: 'rev-6',
    customerName: 'Bagus Wicaksono',
    customerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    rating: 4,
    comment: 'Nostalgia main PS2 Downhill dan Basara bareng ponakan. Alat lengkap kabel converter HDMI-nya berfungsi dengan baik.',
    date: '28 Agustus 2026',
    location: 'Sandubaya, Mataram',
    isVerified: true,
    isApproved: true,
    showOnHomepage: true
  }
];

export const initialSettings: WebsiteSettings = {
  businessName: 'GAME MASTER MATARAM',
  logoUrl: '/logo.jpg',
  tagline: '"Your Game is Game Master"',
  description: 'Rental PlayStation dan gaming console terpercaya di Mataram dan sekitarnya.',
  locationArea: 'Mataram dan sekitarnya',
  consolesSummary: 'PS4 • PS3 • Nintendo Switch • PS2 • TV',
  whatsappNumber: '6281936774036',
  instagramHandle: '@gamemaster.mataram',
  tiktokHandle: '@gamemastermataram',
  address: 'Jl. Majapahit No. 88, Kekalik Jaya, Kec. Sekarbela, Kota Mataram, NTB 83115',
  heroTitle: 'GAME MASTER MATARAM',
  heroTagline: '"Main Seru, Tinggal Booking."',
  heroDescription: 'Rental PlayStation & Gaming Console Mataram dan Sekitarnya',
  ctaTitle: 'SIAP MAIN?',
  ctaSubtitle: 'Booking PlayStation favoritmu sekarang.',
  footerText: 'GAME MASTER MATARAM - Rental PlayStation & Gaming Console Mataram dan sekitarnya. Solusi hiburan gaming berkualitas, unit terawat, dan harga bersahabat.',
  accentColor: '#10B981',
  features: [
    { id: 'f1', title: 'Harga transparan', description: 'Semua harga tertera jelas tanpa ada biaya tersembunyi.', icon: 'Tag' },
    { id: 'f2', title: 'Booking mudah', description: 'Cukup pilih unit dan durasi, langsung konfirmasi WhatsApp.', icon: 'CheckCircle2' },
    { id: 'f3', title: 'Antar–jemput', description: 'Layanan antar dan jemput unit langsung ke lokasi Anda.', icon: 'Truck' },
    { id: 'f4', title: 'Pilihan console lengkap', description: 'Tersedia PS4, PS3, Nintendo Switch, PS2, hingga paket TV 32 inch.', icon: 'Gamepad2' },
    { id: 'f5', title: 'Proses cepat', description: 'Konfirmasi ketersediaan dan pengiriman unit kilat dan tepat waktu.', icon: 'Zap' },
    { id: 'f6', title: 'Pelayanan ramah', description: 'Customer service ramah dan siap membantu kebutuhan gaming Anda.', icon: 'Smile' }
  ],
  rentalSteps: [
    { step: 'STEP 01', title: 'Pilih perangkat', description: 'Temukan konsol favorit seperti PS4, PS3, Nintendo Switch, atau paket TV.', icon: 'Gamepad2' },
    { step: 'STEP 02', title: 'Pilih durasi', description: 'Pilih paket durasi fleksibel mulai dari harian hingga mingguan hemat.', icon: 'Clock' },
    { step: 'STEP 03', title: 'Isi data booking', description: 'Lengkapi formulir singkat nama, nomor WhatsApp, dan alamat pengantaran.', icon: 'FileText' },
    { step: 'STEP 04', title: 'Konfirmasi WhatsApp', description: 'Dapatkan Booking ID dan kirim detail booking ke admin melalui WhatsApp.', icon: 'MessageSquare' },
    { step: 'STEP 05', title: 'Perangkat diantar', description: 'Unit console terawat siap main diantar tepat waktu langsung ke lokasi.', icon: 'Truck' }
  ]
};

export const initialMedia: MediaItem[] = [
  {
    id: 'med-1',
    title: 'PlayStation 4 Slim Main Photo',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80',
    category: 'product',
    createdAt: '2026-09-01T00:00:00Z'
  },
  {
    id: 'med-2',
    title: 'DualShock 4 Controller Setup',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1507457379470-08b800bebc67?auto=format&fit=crop&w=1000&q=80',
    category: 'product',
    createdAt: '2026-09-01T00:00:00Z'
  },
  {
    id: 'med-3',
    title: 'Paket PS4 + TV 32 Inch',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1000&q=80',
    category: 'product',
    createdAt: '2026-09-01T00:00:00Z'
  },
  {
    id: 'med-4',
    title: 'Nintendo Switch Setup',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1000&q=80',
    category: 'product',
    createdAt: '2026-09-01T00:00:00Z'
  },
  {
    id: 'med-5',
    title: 'Gaming Room Showcase',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    category: 'hero',
    createdAt: '2026-09-01T00:00:00Z'
  }
];
