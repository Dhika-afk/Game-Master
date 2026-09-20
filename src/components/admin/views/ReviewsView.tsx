import React, { useState } from 'react';
import {
  Star,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  CheckCircle,
  X,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { CustomerReview } from '../../../types.js';
import { createReviewApi, updateReviewApi, deleteReviewApi } from '../../../api.js';

interface ReviewsViewProps {
  reviews: CustomerReview[];
  onReviewsUpdated: () => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({ reviews, onReviewsUpdated }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<CustomerReview | null>(null);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhoto, setCustomerPhoto] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [location, setLocation] = useState('Mataram');
  const [isVerified, setIsVerified] = useState(true);
  const [isApproved, setIsApproved] = useState(true);
  const [showOnHomepage, setShowOnHomepage] = useState(true);
  const [saving, setSaving] = useState(false);

  // Average calculations
  const avg = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : '0';

  const handleOpenAdd = () => {
    setEditingReview(null);
    setCustomerName('');
    setCustomerPhoto('');
    setRating(5);
    setComment('PS-nya bersih, controller lengkap dan proses booking cepat.');
    setLocation('Mataram');
    setIsVerified(true);
    setIsApproved(true);
    setShowOnHomepage(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (r: CustomerReview) => {
    setEditingReview(r);
    setCustomerName(r.customerName);
    setCustomerPhoto(r.customerPhoto || '');
    setRating(r.rating);
    setComment(r.comment);
    setLocation(r.location || 'Mataram');
    setIsVerified(r.isVerified);
    setIsApproved(r.isApproved);
    setShowOnHomepage(r.showOnHomepage);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    try {
      setSaving(true);
      const payload: Partial<CustomerReview> = {
        customerName: customerName.trim(),
        customerPhoto: customerPhoto.trim() || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customerName)}`,
        rating: Number(rating) || 5,
        comment: comment.trim(),
        location: location.trim(),
        isVerified,
        isApproved,
        showOnHomepage
      };

      if (editingReview) {
        await updateReviewApi(editingReview.id, payload);
      } else {
        await createReviewApi(payload as any);
      }

      setModalOpen(false);
      onReviewsUpdated();
    } catch (err) {
      console.error('Failed to save review', err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleHomepage = async (r: CustomerReview) => {
    try {
      await updateReviewApi(r.id, { showOnHomepage: !r.showOnHomepage });
      onReviewsUpdated();
    } catch (err) {
      console.error('Failed to toggle homepage review', err);
    }
  };

  const handleDelete = async (r: CustomerReview) => {
    if (!window.confirm(`Hapus review dari "${r.customerName}"?`)) return;
    try {
      await deleteReviewApi(r.id);
      onReviewsUpdated();
    } catch (err) {
      console.error('Failed to delete review', err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-['Outfit']">
            Manajemen Review & Testimoni Pelanggan
          </h2>
          <p className="text-xs text-neutral-400">
            Total {reviews.length} testimoni • Rata-rata Skor: <span className="text-amber-400 font-bold font-mono">{avg} / 5</span> (Otomatis terhitung di homepage)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Review Manual</span>
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className={`p-5 rounded-2xl border bg-neutral-900/80 flex flex-col justify-between transition-all ${
              r.showOnHomepage ? 'border-neutral-800' : 'border-neutral-800 opacity-60'
            }`}
          >
            <div>
              {/* Header: Stars & Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-amber-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {r.isVerified && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Verified
                    </span>
                  )}
                  {!r.showOnHomepage && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-400">
                      Hidden
                    </span>
                  )}
                </div>
              </div>

              {/* Comment */}
              <p className="text-xs text-neutral-300 italic mb-4 leading-relaxed line-clamp-3">
                "{r.comment}"
              </p>
            </div>

            {/* Author & Actions */}
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={r.customerPhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(r.customerName)}`}
                  alt={r.customerName}
                  className="w-8 h-8 rounded-full bg-neutral-950 border border-neutral-800 object-cover"
                />
                <div>
                  <span className="text-xs font-bold text-white block leading-tight">
                    {r.customerName}
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    {r.location || 'Mataram'} • {r.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleHomepage(r)}
                  className={`p-1.5 rounded-lg text-xs ${
                    r.showOnHomepage ? 'bg-neutral-800 text-neutral-300' : 'bg-emerald-950 text-emerald-400'
                  }`}
                  title={r.showOnHomepage ? 'Sembunyikan dari homepage' : 'Tampilkan di homepage'}
                >
                  {r.showOnHomepage ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleOpenEdit(r)}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white"
                  title="Edit Review"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(r)}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400"
                  title="Hapus Review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white font-['Outfit']">
                {editingReview ? 'Edit Review Pelanggan' : 'Tambah Review Baru'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                  Nama Pelanggan *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Dimas Bagus"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                  Lokasi / Domisili
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Ampenan, Mataram"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                  Rating Bintang
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                  Komentar / Ulasan *
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ulasan pengalaman rental..."
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                  URL Foto Profil (Opsional)
                </label>
                <input
                  type="url"
                  value={customerPhoto}
                  onChange={(e) => setCustomerPhoto(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
                />
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVerified}
                    onChange={(e) => setIsVerified(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 bg-neutral-950 border-neutral-800"
                  />
                  <span>Tandai sebagai "Verified Customer"</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnHomepage}
                    onChange={(e) => setShowOnHomepage(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 bg-neutral-950 border-neutral-800"
                  />
                  <span>Tampilkan di homepage</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs uppercase tracking-wider"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
