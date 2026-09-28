import React, { useState, useMemo } from 'react';
import { Search, Gamepad2, Info, Check, ArrowRight, Star } from 'lucide-react';
import { Product, CategoryType } from '../types.js';
import { formatRupiah, getLowestPrice } from '../utils/formatters.js';

interface CatalogSectionProps {
  products: Product[];
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onViewProductDetail: (product: Product) => void;
  onBookProduct: (product: Product) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onViewProductDetail,
  onBookProduct
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFamilyFilter, setQuickFamilyFilter] = useState<'Semua' | 'PS4' | 'PS3' | 'Switch' | 'PS2' | 'TV'>('Semua');

  // Filter products based on search query, category, and quick filter
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Must be active
      if (!product.isActive) return false;

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.shortDesc.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      if (!matchSearch) return false;

      // Category chip match
      if (selectedCategory !== 'ALL' && product.category !== selectedCategory) {
        return false;
      }

      // Quick Family Filter match
      if (quickFamilyFilter === 'PS4') {
        return product.name.includes('PS4') || product.category.includes('PS4');
      }
      if (quickFamilyFilter === 'PS3') {
        return product.name.includes('PS3') || product.category.includes('PS3');
      }
      if (quickFamilyFilter === 'Switch') {
        return product.name.toLowerCase().includes('switch') || product.category.toLowerCase().includes('switch');
      }
      if (quickFamilyFilter === 'PS2') {
        return product.name.includes('PS2') || product.category.includes('PS2');
      }
      if (quickFamilyFilter === 'TV') {
        return product.name.includes('TV') || product.category.includes('TV');
      }

      return true;
    });
  }, [products, searchQuery, selectedCategory, quickFamilyFilter]);

  return (
    <section id="katalog" className="py-20 bg-neutral-950 text-neutral-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Katalog Unit Ready</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-['Outfit'] mb-3">
            KATALOG RENTAL
          </h2>
          <p className="text-base sm:text-lg text-neutral-400">
            Pilih perangkat yang ingin kamu sewa. Unit original, game terupdate, dan siap antar ke lokasimu di Mataram.
          </p>
        </div>

        {/* Search & Quick Filter Bar */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 backdrop-blur-sm">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              id="catalog-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari PlayStation atau perangkat..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Quick Category Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {(['Semua', 'PS4', 'PS3', 'Switch', 'PS2', 'TV'] as const).map((filterName) => (
              <button
                key={filterName}
                onClick={() => {
                  setQuickFamilyFilter(filterName);
                  if (selectedCategory !== 'ALL' && filterName === 'Semua') {
                    onSelectCategory('ALL');
                  }
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  quickFamilyFilter === filterName
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                {filterName}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/40 rounded-3xl border border-neutral-800">
            <Gamepad2 className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Perangkat Tidak Ditemukan</h3>
            <p className="text-sm text-neutral-400 mb-6">
              Tidak ada console yang cocok dengan pencarian "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setQuickFamilyFilter('Semua');
                onSelectCategory('ALL');
              }}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-semibold transition-colors"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const lowestPrice = getLowestPrice(product);
              const defaultDuration = product.prices?.[0]?.duration || 'hari';

              return (
                <div
                  key={product.id}
                  id={`product-card-${product.slug}`}
                  className="group flex flex-col bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-blue-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-950/30"
                >
                  {/* Image Container with Badges */}
                  <div className="relative aspect-video sm:aspect-square overflow-hidden bg-neutral-950">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/logo.jpg';
                      }}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60"></div>

                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-gradient-to-r from-red-600 to-rose-600 text-white text-[11px] font-extrabold tracking-wider uppercase shadow-md shadow-red-950/50">
                        {product.badge}
                      </div>
                    )}

                    {/* Category pill */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-neutral-950/80 backdrop-blur border border-neutral-800 text-neutral-300 text-[11px] font-semibold">
                      {product.category}
                    </div>

                    {/* Price Tag Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between">
                      <div className="bg-neutral-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-800/80">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block leading-tight">
                          Mulai dari
                        </span>
                        <span className="text-base font-extrabold text-cyan-400 font-['Outfit']">
                          {formatRupiah(lowestPrice)}
                        </span>
                        <span className="text-[10px] text-neutral-400 ml-1">
                          / {defaultDuration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      {/* Product Name */}
                      <h3 className="text-xl font-bold text-white font-['Outfit'] group-hover:text-blue-400 transition-colors mb-1">
                        {product.name}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
                        {product.shortDesc}
                      </p>

                      {/* Included Items Preview */}
                      {product.includedItems && product.includedItems.length > 0 && (
                        <div className="space-y-1 mb-5">
                          {product.includedItems.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-neutral-300">
                              <Check className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                              <span className="truncate">{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-800/80">
                      <button
                        id={`btn-detail-${product.slug}`}
                        onClick={() => onViewProductDetail(product)}
                        className="w-full py-2 px-3 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 rounded-xl transition-colors flex items-center justify-center gap-1"
                      >
                        <Info className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Lihat Detail</span>
                      </button>

                      <button
                        id={`btn-book-${product.slug}`}
                        onClick={() => onBookProduct(product)}
                        className="w-full py-2 px-3 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 active:scale-95 rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-1"
                      >
                        <Gamepad2 className="w-3.5 h-3.5 text-blue-200" />
                        <span>Booking</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
