import React from 'react';

interface LogoProps {
  className?: string;
  imgClassName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showBadge?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  imgClassName = '',
  size = 'md',
  showBadge = false
}) => {
  const sizeClasses = {
    xs: 'w-7 h-7 rounded-lg',
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-20 h-20 sm:w-24 sm:h-24 rounded-3xl',
    '2xl': 'w-28 h-28 sm:w-36 sm:h-36 rounded-3xl'
  };

  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      <div
        className={`relative overflow-hidden bg-black border border-neutral-800 shadow-lg shadow-black/60 flex items-center justify-center ${sizeClasses[size]}`}
      >
        <img
          src="/images/logo.jpg"
          alt="GAME MASTER Logo"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/logo.jpg';
          }}
          className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${imgClassName}`}
        />
        {/* Subtle glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none"></div>
      </div>

      {showBadge && (
        <span className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-red-600 via-amber-500 to-blue-600 text-white shadow-md">
          2017
        </span>
      )}
    </div>
  );
};
