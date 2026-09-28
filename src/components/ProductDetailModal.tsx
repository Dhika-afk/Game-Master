import React, { useState } from 'react';
import { X, Check, Gamepad2, Sparkles, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { Product, ProductPrice } from '../types.js';
import { formatRupiah } from '../utils/formatters.js';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBookWithDuration: (product: Product, selectedPrice: ProductPrice | null) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBookWithDuration
}) => {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState<string>(product.mainImage);
  const [selectedPrice, setSelectedPrice] = useState<ProductPrice | null>(
    product.prices && product.prices.length > 0 ? product.prices[0] : null
  );

  React.useEffect(() => {
    if (product) {
      setActiveImage(product.mainImage);
      setSelectedPrice(product.prices && product.prices.length > 0 ? product.prices[0] : null);
    }
  }, [product]);

  const images = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.mainImage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        id="product-detail-modal"
        className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/80 bg-neutral-950/60 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {product.category}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white font-['Outfit']">
              Detail {product.name}
            </h3>
          </div>
          <button
            id="close-product-detail"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Images */}
            <div className="space-y-4">
              {/* Big Photo */}
              <div className="relative aspect-video sm:aspect-4/3 rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-lg">
                <img
                  src={activeImage}
                  alt={product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/logo.jpg';
                  }}
                  className="w-full h-full object-cover object-center"
                />
                {product.badge && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-black uppercase tracking-wider shadow">
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        activeImage === img
                          ? 'border-blue-500 scale-95 shadow-md shadow-blue-500/20'
                          : 'border-neutral-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`${product.name} preview ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Key Features Checkbox List */}
              <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/80 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Informasi Rental:
                </h4>
                {(product.features || [
                  'Rental PlayStation',
                  'Antar–jemput',
                  'Wilayah Mataram dan sekitarnya',
                  'Peralatan lengkap'
                ]).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-neutral-200">
                    <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Info & Pricing */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] mb-2">
                  {product.name}
                </h2>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {product.description || product.shortDesc}
                </p>
              </div>

              {/* Included items */}
              {product.includedItems && product.includedItems.length > 0 && (
                <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    Kelengkapan Unit:
                  </h4>
                  <ul className="grid grid-cols-1 gap-1.5 text-xs sm:text-sm text-neutral-300">
                    {product.includedItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pricing Cards Selection */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Pilihan Durasi & Tarif:
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {product.prices && product.prices.length > 0 ? (
                    product.prices.map((pr) => {
                      const isSelected = selectedPrice?.id === pr.id;
                      return (
                        <div
                          key={pr.id}
                          onClick={() => setSelectedPrice(pr)}
                          className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-950/30'
                              : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-blue-400 bg-blue-500' : 'border-neutral-600'
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 bg-neutral-950 rounded-full" />}
                            </div>
                            <div>
                              <span className="text-sm font-bold text-white block">
                                {pr.duration}
                              </span>
                              {pr.label && (
                                <span className="text-[10px] text-cyan-400 font-medium">
                                  {pr.label}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-base font-extrabold text-blue-400 font-['Outfit'] block">
                              {formatRupiah(pr.price)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-neutral-400">Harga hubungi admin.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-6 bg-neutral-950/90 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 z-10">
          <div className="text-center sm:text-left">
            <span className="text-xs text-neutral-400 block">Total Paket Dipilih:</span>
            <span className="text-xl font-extrabold text-white font-['Outfit']">
              {selectedPrice ? formatRupiah(selectedPrice.price) : 'Pilih durasi'}
              {selectedPrice && (
                <span className="text-xs text-neutral-400 font-normal ml-2">
                  ({selectedPrice.duration})
                </span>
              )}
            </span>
          </div>

          <button
            id="modal-btn-booking-duration"
            onClick={() => onBookWithDuration(product, selectedPrice)}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-sm tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>BOOKING SEKARANG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
