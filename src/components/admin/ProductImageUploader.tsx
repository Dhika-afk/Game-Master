import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  Sparkles,
  Zap,
  ExternalLink
} from 'lucide-react';
import {
  optimizeProductImage,
  OptimizedImageResult,
  formatFileSize
} from '../../utils/imageOptimizer.js';
import {
  isSupabaseConfigured,
  uploadProductImageToStorage
} from '../../lib/supabase.js';

interface ProductImageUploaderProps {
  currentImageUrl: string;
  onImageUploaded: (url: string) => void;
  label?: string;
  required?: boolean;
}

export const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  currentImageUrl,
  onImageUploaded,
  label = 'Foto Produk',
  required = true
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimizationStats, setOptimizationStats] = useState<OptimizedImageResult | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string>(currentImageUrl || '');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isConfigured = isSupabaseConfigured();

  const handleProcessFile = async (file: File) => {
    setError(null);
    setOptimizing(true);
    setOptimizationStats(null);

    try {
      // 1. Client-side Image Optimization (Resize max 1200px, compress <300KB)
      const optimized = await optimizeProductImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        targetMaxSizeBytes: 300 * 1024,
        initialQuality: 0.8
      });

      setOptimizationStats(optimized);
      setPreviewSrc(optimized.previewUrl);
      setOptimizing(false);

      // 2. Upload to Supabase Storage if configured
      if (isConfigured) {
        setUploading(true);
        try {
          const { publicUrl } = await uploadProductImageToStorage(optimized.file);
          setPreviewSrc(publicUrl);
          onImageUploaded(publicUrl);
        } catch (uploadErr: any) {
          setError(
            `Optimasi sukses (${formatFileSize(optimized.compressedSize)}), tapi upload Supabase Storage gagal: ${uploadErr.message}. Menggunakan URL sementara.`
          );
          // Fallback to preview URL so user can still proceed with local testing
          onImageUploaded(optimized.previewUrl);
        } finally {
          setUploading(false);
        }
      } else {
        // Supabase not yet set in .env
        onImageUploaded(optimized.previewUrl);
      }
    } catch (err: any) {
      setOptimizing(false);
      setUploading(false);
      setError(err?.message || 'Terjadi kesalahan saat memproses gambar.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleReset = () => {
    setPreviewSrc('');
    setOptimizationStats(null);
    setError(null);
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-neutral-300 uppercase flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>{label} {required && <span className="text-emerald-400">*</span>}</span>
        </label>

        {isConfigured ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Supabase Storage Aktif
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-500/30" title="Masukkan VITE_SUPABASE_URL & ANON_KEY untuk upload ke cloud">
            <Zap className="w-3 h-3" /> Mode Preview (Kompresi Lokal)
          </span>
        )}
      </div>

      {/* Upload Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all p-5 flex flex-col items-center justify-center text-center group ${
          dragActive
            ? 'border-emerald-500 bg-emerald-950/30'
            : 'border-neutral-800 hover:border-emerald-500/60 bg-neutral-950/70 hover:bg-neutral-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={handleFileChange}
          className="hidden"
        />

        {optimizing || uploading ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-center">
              <span className="text-sm font-bold text-white block">
                {optimizing ? 'Mengoptimasi Gambar...' : 'Mengupload ke Supabase Storage...'}
              </span>
              <span className="text-xs text-neutral-400">
                {optimizing
                  ? 'Resize max 1200px & kompres target <300KB'
                  : 'Menyimpan ke bucket product-images'}
              </span>
            </div>
          </div>
        ) : previewSrc ? (
          <div className="w-full flex flex-col sm:flex-row items-center gap-4">
            {/* Image Thumbnail */}
            <div className="relative w-36 h-28 sm:w-44 sm:h-32 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-900 flex-shrink-0 group/img">
              <img
                src={previewSrc}
                alt="Preview Produk"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/logo.jpg';
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[11px] font-bold text-white bg-black/70 px-2 py-1 rounded-md">
                  Klik Ganti
                </span>
              </div>
            </div>

            {/* Details & Actions */}
            <div className="flex-1 text-left space-y-2 w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Gambar Siap Digunakan
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                  title="Hapus gambar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Compression stats if available */}
              {optimizationStats && (
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] space-y-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-neutral-400">Ukuran Asli:</span>
                    <span className="text-neutral-300">{formatFileSize(optimizationStats.originalSize)} ({optimizationStats.originalWidth}x{optimizationStats.originalHeight}px)</span>
                  </div>
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-emerald-400">Setelah Kompres:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-white">{formatFileSize(optimizationStats.compressedSize)}</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                        -{optimizationStats.compressionRatio}%
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Dimensi: {optimizationStats.width}x{optimizationStats.height}px ({optimizationStats.format})
                  </div>
                </div>
              )}

              <p className="text-[11px] text-neutral-400 line-clamp-1 truncate font-mono">
                {previewSrc.startsWith('data:') ? 'Local compressed data' : previewSrc}
              </p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Ganti Gambar
              </button>
            </div>
          </div>
        ) : (
          <div className="py-5 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 group-hover:border-emerald-500/50 flex items-center justify-center mx-auto transition-colors">
              <Upload className="w-6 h-6 text-neutral-400 group-hover:text-emerald-400 transition-colors" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Pilih atau Tarik File Gambar ke Sini
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">
                Mendukung format JPG, PNG, WEBP dari Komputer / HP
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
              <Sparkles className="w-3 h-3" /> Auto-Resize Max 1200px & Kompres &lt;300KB
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
