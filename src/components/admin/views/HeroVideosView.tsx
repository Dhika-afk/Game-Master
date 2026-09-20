import React, { useState } from 'react';
import {
  Video,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Image,
  ArrowUp,
  ArrowDown,
  X,
  Play
} from 'lucide-react';
import { HeroVideo } from '../../../types.js';
import { createHeroVideoApi, updateHeroVideoApi, deleteHeroVideoApi } from '../../../api.js';

interface HeroVideosViewProps {
  videos: HeroVideo[];
  onVideosUpdated: () => void;
}

export const HeroVideosView: React.FC<HeroVideosViewProps> = ({ videos, onVideosUpdated }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<HeroVideo | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);
  const [saving, setSaving] = useState(false);

  const handleOpenAdd = () => {
    setEditingVideo(null);
    setTitle('Rental Console Mataram');
    setSubtitle('Main Seru, Tinggal Booking.');
    setVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-playing-a-video-game-with-a-controller-41975-large.mp4');
    setThumbnailUrl('https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1600&q=80');
    setIsActive(true);
    setSortOrder(videos.length + 1);
    setModalOpen(true);
  };

  const handleOpenEdit = (v: HeroVideo) => {
    setEditingVideo(v);
    setTitle(v.title);
    setSubtitle(v.subtitle || '');
    setVideoUrl(v.videoUrl);
    setThumbnailUrl(v.thumbnailUrl || '');
    setIsActive(v.isActive);
    setSortOrder(v.sortOrder || 1);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) return;

    try {
      setSaving(true);
      const payload: Partial<HeroVideo> = {
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        videoUrl: videoUrl.trim(),
        thumbnailUrl: thumbnailUrl.trim() || undefined,
        isActive,
        sortOrder: Number(sortOrder) || 1
      };

      if (editingVideo) {
        await updateHeroVideoApi(editingVideo.id, payload);
      } else {
        await createHeroVideoApi(payload as any);
      }

      setModalOpen(false);
      onVideosUpdated();
    } catch (err) {
      console.error('Failed to save hero video', err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (v: HeroVideo) => {
    try {
      await updateHeroVideoApi(v.id, { isActive: !v.isActive });
      onVideosUpdated();
    } catch (err) {
      console.error('Failed to toggle active', err);
    }
  };

  const handleDelete = async (v: HeroVideo) => {
    if (!window.confirm(`Hapus video carousel "${v.title}"?`)) return;
    try {
      await deleteHeroVideoApi(v.id);
      onVideosUpdated();
    } catch (err) {
      console.error('Failed to delete video', err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-['Outfit']">
            Manajemen Video Hero Carousel
          </h2>
          <p className="text-xs text-neutral-400">
            Kelola background video gaming dan urutan tampilan pada hero section utama di homepage.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Video Baru</span>
        </button>
      </div>

      {/* Videos List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((v) => (
          <div
            key={v.id}
            className={`rounded-2xl border bg-neutral-900/80 overflow-hidden flex flex-col justify-between transition-all ${
              v.isActive ? 'border-neutral-800' : 'border-neutral-800 opacity-60'
            }`}
          >
            {/* Video preview / thumbnail */}
            <div className="relative aspect-video bg-neutral-950 overflow-hidden">
              <video
                src={v.videoUrl}
                poster={v.thumbnailUrl}
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 flex gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-950/80 border border-neutral-800 text-neutral-300">
                  Urutan #{v.sortOrder}
                </span>
                {!v.isActive && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500 text-white">
                    Nonaktif
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-base font-['Outfit'] mb-1">
                  {v.title}
                </h3>
                {v.subtitle && (
                  <p className="text-xs text-emerald-400 font-semibold mb-2">
                    {v.subtitle}
                  </p>
                )}
                <span className="text-[11px] font-mono text-neutral-500 truncate block">
                  {v.videoUrl}
                </span>
              </div>

              {/* Actions */}
              <div className="pt-3 mt-3 border-t border-neutral-800 flex items-center justify-between">
                <button
                  onClick={() => handleToggleActive(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                    v.isActive
                      ? 'bg-neutral-800 text-neutral-300 hover:text-white'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {v.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{v.isActive ? 'Aktif' : 'Nonaktif'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(v)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
                    title="Edit Video"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(v)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 transition-colors"
                    title="Hapus Video"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Video Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white font-['Outfit']">
                {editingVideo ? 'Edit Video Hero' : 'Tambah Video Hero Baru'}
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
                  Judul Video / Slide
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Gameplay Seru PS4 & PS3"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                  Sub-judul / Tagline Singkat
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Contoh: Rasakan sensasi grafis memukau"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase mb-1 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                  URL Video MP4 *
                </label>
                <input
                  type="url"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://.../video.mp4"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase mb-1 flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5 text-emerald-400" />
                  URL Poster / Thumbnail Cadangan
                </label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                  Urutan Slide Carousel (1, 2, 3...)
                </label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="hero-video-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 bg-neutral-950 border-neutral-800"
                />
                <label htmlFor="hero-video-active" className="text-xs text-neutral-300 font-semibold cursor-pointer">
                  Aktifkan video ini di carousel homepage
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
                  {saving ? 'Menyimpan...' : 'Simpan Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
