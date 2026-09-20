import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Clock,
  AlertCircle,
  Gamepad2
} from 'lucide-react';
import { Product, ProductPrice } from '../../../types.js';
import { updateProductApi } from '../../../api.js';
import { formatRupiah } from '../../../utils/formatters.js';

interface PricesViewProps {
  products: Product[];
  onProductsUpdated: () => void;
}

export const PricesView: React.FC<PricesViewProps> = ({ products, onProductsUpdated }) => {
  // Selected product to manage prices
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');

  // Add Duration Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDuration, setNewDuration] = useState('1 Hari');
  const [newPrice, setNewPrice] = useState(110000);
  const [newLabel, setNewLabel] = useState('');

  // Inline editing state for an existing price item
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editDuration, setEditDuration] = useState('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editLabel, setEditLabel] = useState('');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handleStartEdit = (item: ProductPrice) => {
    setEditingPriceId(item.id);
    setEditDuration(item.duration);
    setEditPrice(item.price);
    setEditLabel(item.label || '');
  };

  const handleSaveEdit = async () => {
    if (!selectedProduct || !editingPriceId) return;

    try {
      setSaving(true);
      const updatedPrices = (selectedProduct.prices || []).map(p => {
        if (p.id === editingPriceId) {
          return {
            ...p,
            duration: editDuration.trim(),
            price: Number(editPrice) || 0,
            label: editLabel.trim() || undefined
          };
        }
        return p;
      });

      await updateProductApi(selectedProduct.id, { prices: updatedPrices });
      setEditingPriceId(null);
      setMessage(`Tarif untuk "${selectedProduct.name}" berhasil diperbarui!`);
      setTimeout(() => setMessage(null), 3000);
      onProductsUpdated();
    } catch (err: any) {
      console.error('Error saving price:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePrice = async (priceId: string) => {
    if (!selectedProduct) return;
    if (!window.confirm('Hapus paket durasi harga ini?')) return;

    try {
      setSaving(true);
      const updatedPrices = (selectedProduct.prices || []).filter(p => p.id !== priceId);
      await updateProductApi(selectedProduct.id, { prices: updatedPrices });
      onProductsUpdated();
    } catch (err: any) {
      console.error('Error deleting price:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !newDuration.trim()) return;

    try {
      setSaving(true);
      const newPriceItem: ProductPrice = {
        id: `pr-${Date.now()}`,
        duration: newDuration.trim(),
        price: Number(newPrice) || 0,
        label: newLabel.trim() || undefined
      };

      const currentPrices = selectedProduct.prices || [];
      const updatedPrices = [...currentPrices, newPriceItem];

      await updateProductApi(selectedProduct.id, { prices: updatedPrices });
      setIsAddModalOpen(false);
      setNewDuration('1 Hari');
      setNewPrice(110000);
      setNewLabel('');
      setMessage(`Paket durasi baru berhasil ditambahkan ke ${selectedProduct.name}!`);
      setTimeout(() => setMessage(null), 3000);
      onProductsUpdated();
    } catch (err: any) {
      console.error('Error adding price:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-['Outfit']">
            Manajemen Harga & Paket Durasi
          </h2>
          <p className="text-xs text-neutral-400">
            Ubah tarif sewa harian/mingguan atau tambah pilihan durasi baru. Perubahan langsung aktif di website customer.
          </p>
        </div>

        {selectedProduct && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Durasi Baru</span>
          </button>
        )}
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Product Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {products.map((p) => {
          const isSelected = p.id === (selectedProduct ? selectedProduct.id : '');
          return (
            <button
              key={p.id}
              onClick={() => {
                setSelectedProductId(p.id);
                setEditingPriceId(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-emerald-500 text-neutral-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* Current Product Prices Table */}
      {selectedProduct && (
        <div className="p-6 rounded-3xl bg-neutral-900/70 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-3">
              <img
                src={selectedProduct.mainImage}
                alt={selectedProduct.name}
                className="w-12 h-12 rounded-xl object-cover border border-neutral-800 bg-neutral-950"
              />
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
                  Daftar Tarif: {selectedProduct.name}
                </h3>
                <span className="text-xs text-emerald-400 font-semibold">
                  Kategori: {selectedProduct.category}
                </span>
              </div>
            </div>
            <span className="text-xs text-neutral-400 hidden sm:inline">
              {(selectedProduct.prices || []).length} Pilihan Durasi
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="border-b border-neutral-800 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Durasi Sewa</th>
                  <th className="py-3 px-3">Label / Keterangan</th>
                  <th className="py-3 px-3">Tarif Rental (IDR)</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850">
                {(selectedProduct.prices || []).map((pr) => {
                  const isEditing = editingPriceId === pr.id;

                  if (isEditing) {
                    return (
                      <tr key={pr.id} className="bg-emerald-950/20">
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            value={editDuration}
                            onChange={(e) => setEditDuration(e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500 w-36"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            placeholder="Misal: Paling Laris"
                            className="px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500 w-36"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1">
                            <span className="text-neutral-500 text-xs">Rp</span>
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                              className="px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500 w-32 font-mono font-bold"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right space-x-2">
                          <button
                            onClick={handleSaveEdit}
                            disabled={saving}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs transition-colors"
                          >
                            Simpan
                          </button>
                          <button
                            onClick={() => setEditingPriceId(null)}
                            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs transition-colors"
                          >
                            Batal
                          </button>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={pr.id} className="hover:bg-neutral-850/50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{pr.duration}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-neutral-400">
                        {pr.label || '-'}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400 text-sm">
                        {formatRupiah(pr.price)}
                      </td>
                      <td className="py-3 px-3 text-right space-x-1.5">
                        <button
                          onClick={() => handleStartEdit(pr)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                          title="Edit Durasi & Harga"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePrice(pr.id)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-950/50 text-neutral-400 hover:text-rose-400 transition-colors"
                          title="Hapus Paket Durasi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add New Price Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Tambah Durasi Baru ({selectedProduct?.name})
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPrice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                  Nama Durasi (Contoh: 1 Hari, 5 Hari, 2 Minggu)
                </label>
                <input
                  type="text"
                  required
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  placeholder="Contoh: 5 Hari"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                  Tarif Rental (Rupiah)
                </label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  placeholder="150000"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                  Label / Keterangan (Opsional)
                </label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Contoh: Paket Weekend / Diskon 15%"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs uppercase tracking-wider"
                >
                  {saving ? 'Menyimpan...' : 'Tambahkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
