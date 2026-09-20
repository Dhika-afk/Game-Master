import React from 'react';
import { CategoryType } from '../types.js';

interface CategorySectionProps {
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
}

interface CategoryItem {
  id: CategoryType;
  label: string;
  icon: string;
}

const categories: CategoryItem[] = [
  { id: 'ALL', label: 'Semua Perangkat', icon: '⚡' },
  { id: 'PS4', label: 'PS4', icon: '🎮' },
  { id: 'PS4 + TV', label: 'PS4 + TV', icon: '🎮' },
  { id: 'PS4 BOX', label: 'PS4 BOX', icon: '🎮' },
  { id: 'PS3', label: 'PS3', icon: '🎮' },
  { id: 'PS3 + TV', label: 'PS3 + TV', icon: '🎮' },
  { id: 'PS3 BOX', label: 'PS3 BOX', icon: '🎮' },
  { id: 'Nintendo Switch', label: 'Nintendo Switch', icon: '🎮' },
  { id: 'Nintendo Switch Lite', label: 'Nintendo Switch Lite', icon: '🎮' },
  { id: 'PS2', label: 'PS2', icon: '🎮' },
  { id: 'TV 32 INCH', label: 'TV 32 INCH', icon: '📺' }
];

export const CategorySection: React.FC<CategorySectionProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <section id="kategori-section" className="py-6 bg-neutral-950/60 border-y border-neutral-900/80 sticky top-[64px] sm:top-[72px] z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30 scale-105'
                    : 'bg-neutral-900/80 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span className="whitespace-nowrap">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
