import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Image,
  Tag,
  Check,
  X,
  AlertCircle,
  Gamepad2,
  DollarSign,
  Package,
  Layers
} from 'lucide-react';
import { Product, CategoryType } from '../../../types.js';
import { createProductApi, updateProductApi, deleteProductApi } from '../../../api.js';
import { formatRupiah, getLowestPrice } from '../../../utils/formatters.js';
import { ProductImageUploader } from '../ProductImageUploader.js';

interface CatalogViewProps {
  products: Product[];
  onProductsUpdated: () => void;
}

const CATEGORY_OPTIONS: CategoryType[] = [
  'PS4',
  'PS4 + TV',
  'PS4 BOX',
  'PS3',
  'PS3 + TV',
  'PS3 BOX',
  'Nintendo Switch',
  'Nintendo Switch Lite',
  'PS2',
  'TV 32 INCH'
];

export const CatalogView: React.FC<CatalogViewProps> = ({ products, onProductsUpdated }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>('PS4');
  const [price, setPrice] = useState<number>(90000);
  const [priceUnit, setPriceUnit] = useState<string>('per hari');
  const [status, setStatus] = useState<'available' | 'rented' | 'maintenance'>('available');
  const [stock, setStock] = useState<number>(1);
  const [mainImage, setMainImage] = useState('');
  const [badge, setBadge] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [includedItems, setIncludedItems] = useState('');
  const [features, setFeatures] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setCategory('PS4');
    setPrice(90000);
    setPriceUnit('per hari');
    setStatus('available');
    setStock(2);
    setMainImage('/images/ps4.jpg');
    setBadge('READY UNIT');
    setShortDesc('Paket rental console siap main dengan stick wireless dan game terupdate.');
    setDescription('Paket rental PlayStation lengkap dengan kabel power, HDMI, kabel charger stick, dan game pilihan.');
    setIncludedItems('1x Unit Console\n2x Wireless Controller\nKabel HDMI & Power\nFull Game Terupdate');
    setFeatures('Rental PlayStation\nAntar–jemput\nWilayah Mataram dan sekitarnya\nPeralatan lengkap');
    setIsActive(true);
    setSortOrder(products.length + 1);
    setError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setPrice(p.price || p.prices?.[0]?.price || 90000);
    setPriceUnit(p.price_unit || p.prices?.[0]?.duration || 'per hari');
    setStatus(p.status || (p.isActive ? 'available' : 'maintenance'));
    setStock(p.stock !== undefined ? p.stock : 1);
    setMainImage(p.mainImage || p.image || '');
    setBadge(p.badge || '');
    setShortDesc(p.shortDesc || p.short_description || '');
    setDescription(p.description || '');
    setIncludedItems((p.includedItems || []).join('\n'));
    setFeatures((p.features || []).join('\n'));
    setIsActive(p.isActive);
    setSortOrder(p.sortOrder || 1);
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mainImage.trim()) {
      setError('Nama dan Foto Produk wajib diisi.');
      return;
    }

    try {
      setSaving(true);
      const payload: Partial<Product> = {
        name: name.trim(),
        category,
        price: Number(price) || 0,
        price_unit: priceUnit.trim() || 'per hari',
        status,
        stock: Number(stock) || 1,
        mainImage: mainImage.trim(),
        image: mainImage.trim(),
        badge: badge.trim() || undefined,
        shortDesc: shortDesc.trim(),
        short_description: shortDesc.trim(),
        description: description.trim(),
        includedItems: includedItems.split('\n').map(s => s.trim()).filter(Boolean),
        features: features.split('\n').map(s => s.trim()).filter(Boolean),
        isActive: status !== 'maintenance' && isActive,
        sortOrder: Number(sortOrder) || 1
      };

      if (editingProduct) {
        await updateProductApi(editingProduct.id, payload);
      } else {
        // default starter prices
        payload.prices = [
          { id: `pr-${Date.now()}-1`, duration: priceUnit || '1 Hari', price: Number(price) || 90000, label: 'Tarif Harian' }
        ];
        await createProductApi(payload as any);
      }


      setModalOpen(false);
      onProductsUpdated();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan produk.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (p: Product) => {
    try {
      await updateProductApi(p.id, { isActive: !p.isActive });
      onProductsUpdated();
    } catch (err) {
      console.error('Failed to toggle active', err);
    }
  };

  const handleDelete = async (p: Product) => {
    if (!window.confirm(`Hapus produk "${p.name}"? Semua data harga untuk produk ini juga akan terhapus.`)) {
      return;
    }
    try {
      await deleteProductApi(p.id);
      onProductsUpdated();
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-['Outfit']">
            Katalog Perangkat Rental
          </h2>
          <p className="text-xs text-neutral-400">
            Tambah perangkat baru, ganti foto, ubah kategori, atau sembunyikan unit yang sedang kosong.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Product List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p) => {
          const lowest = getLowestPrice(p);
          return (
            <div
              key={p.id}
              className={`rounded-2xl border bg-neutral-900/80 overflow-hidden flex flex-col justify-between transition-all ${
                p.isActive ? 'border-neutral-800' : 'border-neutral-800 opacity-60'
              }`}
            >
              {/* Image Preview & Badges */}
              <div className="relative aspect-video bg-neutral-950">
                <img
                  src={p.mainImage}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                  {p.badge && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500 text-neutral-950">
                      {p.badge}
                    </span>
                  )}
                  {p.status === 'rented' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500 text-white shadow">
                      Disewa
                    </span>
                  )}
                  {p.status === 'maintenance' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500 text-neutral-950 shadow">
                      Maintenance
                    </span>
                  )}
                  {!p.isActive && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500 text-white">
                      Disembunyikan
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded bg-neutral-950/80 text-[10px] font-semibold text-neutral-300">
                    {p.category}
                  </span>
                  {p.stock !== undefined && (
                    <span className="px-2 py-0.5 rounded bg-neutral-900/90 text-[10px] font-mono font-bold text-neutral-300 border border-neutral-800">
                      Stok: {p.stock}
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="font-bold text-white text-base font-['Outfit']">
                      {p.name}
                    </h3>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {formatRupiah(lowest)}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2 mb-3">
                    {p.shortDesc}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleActive(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                      p.isActive
                        ? 'bg-neutral-800 text-neutral-300 hover:text-white'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                    title={p.isActive ? 'Sembunyikan dari katalog' : 'Tampilkan di katalog'}
                  >
                    {p.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{p.isActive ? 'Aktif' : 'Tersembunyi'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
                      title="Edit Produk"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 transition-colors"
                      title="Hapus Produk"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                {editingProduct ? `Edit ${editingProduct.name}` : 'Tambah Perangkat Baru'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                    Nama Produk *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: PS4 Slim 500GB"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                    Kategori *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <ProductImageUploader
                currentImageUrl={mainImage}
                onImageUploaded={(url) => setMainImage(url)}
                label="Foto Produk (Upload Langsung & Auto-Kompres)"
                required
              />

              {/* Price & Price Unit & Status & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase mb-1 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    Harga Sewa (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="90000"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-750 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                    Satuan Tarif *
                  </label>
                  <input
                    type="text"
                    required
                    value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value)}
                    placeholder="per hari"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-750 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase mb-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    Status Unit *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-750 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="available">Tersedia (Available)</option>
                    <option value="rented">Sedang Disewa (Rented)</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase mb-1 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-emerald-400" />
                    Stok Unit *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    placeholder="1"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-750 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase mb-1 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" />
                    Badge Produk (Opsional)
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Contoh: BEST SELLER / PROMO / READY"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                    Urutan Tampil (Sort Order)
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                  Deskripsi Singkat (Card Katalog)
                </label>
                <input
                  type="text"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Deskripsi 1-2 kalimat untuk card..."
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                  Deskripsi Lengkap (Halaman/Modal Detail)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi detail produk..."
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                    Kelengkapan Unit (1 baris per item)
                  </label>
                  <textarea
                    rows={3}
                    value={includedItems}
                    onChange={(e) => setIncludedItems(e.target.value)}
                    placeholder="1x Unit Console&#10;2x Wireless Stick&#10;Kabel HDMI & Power"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                    Informasi / Fitur (1 baris per poin)
                  </label>
                  <textarea
                    rows={3}
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    placeholder="Rental PlayStation&#10;Antar–jemput&#10;Wilayah Mataram dan sekitarnya"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="product-is-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 bg-neutral-950 border-neutral-800 focus:ring-0"
                />
                <label htmlFor="product-is-active" className="text-xs text-neutral-300 font-semibold cursor-pointer">
                  Tampilkan produk ini di katalog customer (Status Aktif)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs uppercase tracking-wider"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
