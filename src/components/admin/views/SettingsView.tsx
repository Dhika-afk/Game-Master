import React, { useState } from 'react';
import {
  Save,
  Check,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Sparkles,
  Palette,
  AlertCircle
} from 'lucide-react';
import { WebsiteSettings } from '../../../types.js';
import { updateSettingsApi } from '../../../api.js';
import { Logo } from '../../Logo.js';

interface SettingsViewProps {
  settings: WebsiteSettings;
  onSettingsUpdated: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onSettingsUpdated }) => {
  const [formData, setFormData] = useState<WebsiteSettings>({ ...settings });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof WebsiteSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await updateSettingsApi(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
      onSettingsUpdated();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan pengaturan');
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
            Pengaturan Website & Bisnis
          </h2>
          <p className="text-xs text-neutral-400">
            Perbarui nomor WhatsApp admin, alamat toko di Mataram, akun sosial media, dan teks promosi.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-lg shadow-emerald-500/20"
        >
          {saving ? (
            <span>Menyimpan...</span>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </>
          )}
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-5 h-5" />
          <span>Pengaturan website berhasil diperbarui dan telah diterapkan ke seluruh halaman!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Bisnis */}
        <div className="p-6 rounded-3xl bg-neutral-900/70 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Logo Bisnis Game Master</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              Active Official Logo
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80">
            <div className="flex flex-col items-center gap-2">
              <Logo size="xl" showBadge />
              <span className="text-[10px] text-neutral-400 font-mono">Preview Logo</span>
            </div>

            <div className="flex-1 space-y-2 w-full">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                  URL / Path Logo Bisnis
                </label>
                <input
                  type="text"
                  value={formData.logoUrl || '/logo.jpg'}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  placeholder="/logo.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Logo resmi GAME MASTER (since 2017) aktif digunakan di Navbar, Hero banner, Footer, Modal Booking, dan Admin Dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Identitas Bisnis & Kontak Utama */}
        <div className="p-6 rounded-3xl bg-neutral-900/70 border border-neutral-800 space-y-4">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Identitas Bisnis & Kontak Utama</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                Nama Bisnis
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                Nomor WhatsApp Admin (Format 62...)
              </label>
              <input
                type="text"
                required
                value={formData.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                placeholder="6281936774036"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">
                Nomor ini digunakan untuk tombol kirim pesanan, floating WhatsApp, dan link kontak (misal: 6281936774036).
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                Tagline Utama
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Jam Operasional
              </label>
              <input
                type="text"
                value={formData.operationalHours}
                onChange={(e) => handleChange('operationalHours', e.target.value)}
                placeholder="Setiap Hari: 09:00 - 23:00 WITA"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Alamat Fisik / Lokasi Toko
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                Ringkasan Jenis Console (Pill Info)
              </label>
              <input
                type="text"
                value={formData.consolesSummary}
                onChange={(e) => handleChange('consolesSummary', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Media Sosial */}
        <div className="p-6 rounded-3xl bg-neutral-900/70 border border-neutral-800 space-y-4">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Instagram className="w-4 h-4 text-pink-400" />
            <span>Akun Media Sosial</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                Instagram Handle
              </label>
              <input
                type="text"
                value={formData.instagramHandle}
                onChange={(e) => handleChange('instagramHandle', e.target.value)}
                placeholder="@gamemaster.mataram"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                TikTok Handle
              </label>
              <input
                type="text"
                value={formData.tiktokHandle}
                onChange={(e) => handleChange('tiktokHandle', e.target.value)}
                placeholder="@gamemastermataram"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Teks Hero, CTA, & Footer */}
        <div className="p-6 rounded-3xl bg-neutral-900/70 border border-neutral-800 space-y-4">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-400" />
            <span>Teks Banner, CTA, & Footer</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                Judul Hero Homepage
              </label>
              <input
                type="text"
                value={formData.heroTitle}
                onChange={(e) => handleChange('heroTitle', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                Tagline Hero
              </label>
              <input
                type="text"
                value={formData.heroTagline}
                onChange={(e) => handleChange('heroTagline', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                Judul CTA Section
              </label>
              <input
                type="text"
                value={formData.ctaTitle}
                onChange={(e) => handleChange('ctaTitle', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                Sub-judul CTA
              </label>
              <input
                type="text"
                value={formData.ctaSubtitle}
                onChange={(e) => handleChange('ctaSubtitle', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
              Teks Footer & Penjelasan Bisnis
            </label>
            <textarea
              rows={2}
              value={formData.footerText}
              onChange={(e) => handleChange('footerText', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
