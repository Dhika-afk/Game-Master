import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Auth: Admin login
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi.' });
    }
    const result = db.verifyAdmin(username, password);
    if (!result.success || !result.user) {
      return res.status(401).json({ error: 'Username atau password salah.' });
    }

    // Return dummy admin session token
    const token = 'gm_admin_' + Buffer.from(result.user.username + ':' + Date.now()).toString('base64');
    return res.json({
      success: true,
      token,
      user: result.user
    });
  });

  // Products
  app.get('/api/products', (req, res) => {
    try {
      const products = db.getProducts();
      res.json(products);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/products/:id', (req, res) => {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produk tidak ditemukan.' });
    }
    res.json(product);
  });

  app.post('/api/products', (req, res) => {
    try {
      const newProduct = db.createProduct(req.body);
      res.status(201).json(newProduct);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/products/:id', (req, res) => {
    try {
      const updated = db.updateProduct(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Produk tidak ditemukan.' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/products/:id', (req, res) => {
    try {
      const success = db.deleteProduct(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Prices CMS
  app.get('/api/prices', (req, res) => {
    res.json(db.getAllPrices());
  });

  app.post('/api/prices', (req, res) => {
    try {
      const created = db.createPrice(req.body);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/prices/:id', (req, res) => {
    try {
      const updated = db.updatePrice(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Data harga tidak ditemukan.' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/prices/:id', (req, res) => {
    try {
      const success = db.deletePrice(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Bookings
  app.get('/api/bookings', (req, res) => {
    try {
      const bookings = db.getBookings();
      res.json(bookings);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/bookings/:idOrBookingId', (req, res) => {
    const booking = db.getBookingById(req.params.idOrBookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking ID tidak ditemukan.' });
    }
    res.json(booking);
  });

  app.post('/api/bookings', (req, res) => {
    try {
      const {
        customerName,
        customerPhone,
        customerAddress,
        productId,
        productName,
        duration,
        price,
        startDate,
        endDate,
        notes
      } = req.body;

      if (!customerName || !customerPhone || !customerAddress || !productId || !duration) {
        return res.status(400).json({ error: 'Mohon lengkapi semua data wajib pada formulir booking.' });
      }

      const booking = db.createBooking({
        customerName,
        customerPhone,
        customerAddress,
        productId,
        productName: productName || 'Rental Game Master',
        duration,
        price: Number(price) || 0,
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || new Date().toISOString().split('T')[0],
        notes
      });

      res.status(201).json(booking);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/bookings/:id/status', (req, res) => {
    try {
      const { status, adminNotes } = req.body;
      const updated = db.updateBookingStatus(req.params.id, status, adminNotes);
      if (!updated) {
        return res.status(404).json({ error: 'Booking tidak ditemukan.' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/bookings/:id', (req, res) => {
    try {
      const success = db.deleteBooking(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Hero Videos
  app.get('/api/hero-videos', (req, res) => {
    res.json(db.getHeroVideos());
  });

  app.post('/api/hero-videos', (req, res) => {
    try {
      const created = db.createHeroVideo(req.body);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/hero-videos/:id', (req, res) => {
    try {
      const updated = db.updateHeroVideo(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Video hero tidak ditemukan.' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/hero-videos/:id', (req, res) => {
    try {
      const success = db.deleteHeroVideo(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Reviews
  app.get('/api/reviews', (req, res) => {
    res.json(db.getReviews());
  });

  app.post('/api/reviews', (req, res) => {
    try {
      const created = db.createReview(req.body);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/reviews/:id', (req, res) => {
    try {
      const updated = db.updateReview(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Review tidak ditemukan.' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/reviews/:id', (req, res) => {
    try {
      const success = db.deleteReview(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Media
  app.get('/api/media', (req, res) => {
    res.json(db.getMedia());
  });

  app.post('/api/media', (req, res) => {
    try {
      const created = db.createMediaItem(req.body);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/media/:id', (req, res) => {
    try {
      const success = db.deleteMediaItem(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Settings
  app.get('/api/settings', (req, res) => {
    res.json(db.getSettings());
  });

  app.put('/api/settings', (req, res) => {
    try {
      const updated = db.updateSettings(req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin Stats
  app.get('/api/stats', (req, res) => {
    res.json(db.getStats());
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎮 GAME MASTER MATARAM server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
