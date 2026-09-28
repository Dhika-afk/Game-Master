import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Gamepad2, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { HeroVideo, WebsiteSettings } from '../types.js';
import { Logo } from './Logo.js';

interface HeroSectionProps {
  videos: HeroVideo[];
  settings: WebsiteSettings;
  onOpenBooking: () => void;
  onExploreCatalog: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  videos,
  settings,
  onOpenBooking,
  onExploreCatalog
}) => {
  const activeVideos = videos.filter(v => v.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState<Record<string, boolean>>({});
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentSlide = activeVideos[currentIndex] || {
    id: 'default',
    title: settings.heroTitle || 'GAME MASTER MATARAM',
    subtitle: settings.heroTagline || '"Main Seru, Tinggal Booking."',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-playing-a-video-game-with-a-controller-41975-large.mp4',
    thumbnailUrl: '/images/hero-1.jpg',
    isActive: true,
    sortOrder: 1
  };

  // Carousel auto-advance
  useEffect(() => {
    if (activeVideos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeVideos.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [activeVideos.length]);

  const handlePrev = () => {
    if (activeVideos.length <= 1) return;
    setCurrentIndex(prev => (prev === 0 ? activeVideos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (activeVideos.length <= 1) return;
    setCurrentIndex(prev => (prev + 1) % activeVideos.length);
  };

  return (
    <section id="hero-section" className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* Background Media Container */}
      <div className="absolute inset-0 z-0">
        {/* If video errored or no video, fallback to thumbnail */}
        {!videoError[currentSlide.id] && currentSlide.videoUrl ? (
          <video
            ref={videoRef}
            key={currentSlide.videoUrl}
            src={currentSlide.videoUrl}
            poster={currentSlide.thumbnailUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onError={() => {
              setVideoError(prev => ({ ...prev, [currentSlide.id]: true }));
            }}
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
          />
        ) : (
          <img
            src={currentSlide.thumbnailUrl || '/images/hero-1.jpg'}
            alt="Gaming Setup Background"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/hero-1.jpg';
            }}
            className="w-full h-full object-cover object-center"
          />
        )}

        {/* Multi-layered Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/80"></div>
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-neutral-950/50 to-neutral-950"></div>
        <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[1px]"></div>

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 text-center flex flex-col items-center">
        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/80 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md mb-5 shadow-lg shadow-blue-950/40">
          <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
          <span>Rental PlayStation & Console Terpercaya di Mataram</span>
        </div>

        {/* Brand Logo Presentation */}
        <div className="mb-4 relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-red-600/40 via-amber-500/40 via-cyan-400/40 to-blue-600/40 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500"></div>
          <Logo size="xl" showBadge className="relative" />
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white font-['Outfit'] uppercase mb-3 leading-none drop-shadow-2xl">
          {settings.heroTitle || 'GAME MASTER MATARAM'}
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl md:text-3xl font-bold font-['Outfit'] mb-4 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-blue-400">
          {settings.heroTagline || '"Your Game is Game Master"'}
        </p>

        {/* Subtitle / Description */}
        <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          {settings.heroDescription || 'Rental PlayStation & Gaming Console Mataram dan Sekitarnya'}
        </p>

        {/* Highlights List */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-neutral-300 font-medium mb-10">
          <span className="px-3 py-1 rounded-lg bg-neutral-900/90 border border-neutral-800 backdrop-blur">
            🎮 {settings.consolesSummary || 'PS4 • PS3 • Nintendo Switch • PS2 • TV'}
          </span>
          <span className="hidden sm:inline text-neutral-600">•</span>
          <span className="px-3 py-1 rounded-lg bg-neutral-900/90 border border-neutral-800 backdrop-blur">
            🚚 Layanan Antar–Jemput
          </span>
          <span className="hidden sm:inline text-neutral-600">•</span>
          <span className="px-3 py-1 rounded-lg bg-neutral-900/90 border border-neutral-800 backdrop-blur">
            ⚡ Booking Mudah via WhatsApp
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            id="hero-btn-katalog"
            onClick={onExploreCatalog}
            className="w-full sm:w-auto px-8 py-4 text-sm sm:text-base font-bold tracking-wide rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-white border border-neutral-700 hover:border-blue-500/50 transition-all shadow-xl active:scale-95"
          >
            LIHAT KATALOG
          </button>
          <button
            id="hero-btn-booking"
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-8 py-4 text-sm sm:text-base font-bold tracking-wide rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all shadow-xl shadow-blue-600/35 border border-blue-400/30 flex items-center justify-center gap-2 active:scale-95"
          >
            <Gamepad2 className="w-5 h-5 text-blue-200" />
            <span>BOOKING SEKARANG</span>
          </button>
        </div>
      </div>

      {/* Video Carousel Controls */}
      {activeVideos.length > 1 && (
        <>
          <button
            id="hero-carousel-prev"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-neutral-900/60 hover:bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 backdrop-blur transition-all hidden sm:flex items-center justify-center"
            aria-label="Video Sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            id="hero-carousel-next"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-neutral-900/60 hover:bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 backdrop-blur transition-all hidden sm:flex items-center justify-center"
            aria-label="Video Berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Bottom Bar: Indicators & Audio Toggle */}
      <div className="absolute bottom-6 left-0 right-0 z-20 max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Slide Indicators */}
        <div className="flex items-center gap-2">
          {activeVideos.map((video, idx) => (
            <button
              key={video.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all rounded-full ${
                idx === currentIndex
                  ? 'w-8 bg-blue-500 shadow-sm shadow-blue-500/50'
                  : 'w-2 bg-neutral-700 hover:bg-neutral-500'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
          {activeVideos[currentIndex] && (
            <span className="hidden md:inline-block ml-3 text-xs text-neutral-400">
              {activeVideos[currentIndex].title}
            </span>
          )}
        </div>

        {/* Audio Mute/Unmute Toggle */}
        <button
          onClick={() => {
            setIsMuted(!isMuted);
            if (videoRef.current) {
              videoRef.current.muted = !isMuted;
            }
          }}
          className="p-2 rounded-lg bg-neutral-900/70 hover:bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white backdrop-blur text-xs flex items-center gap-1.5 transition-colors"
          title={isMuted ? 'Nyalakan Audio' : 'Matikan Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
          <span className="text-[11px] hidden sm:inline">
            {isMuted ? 'Muted' : 'Audio On'}
          </span>
        </button>
      </div>
    </section>
  );
};
