import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus, User, X, Check } from 'lucide-react';
import { CustomerReview } from '../types.js';
import { createReviewApi } from '../api.js';

interface ReviewsSectionProps {
  reviews: CustomerReview[];
  onReviewSubmitted: (newRev: CustomerReview) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onReviewSubmitted
}) => {
  // Filter approved reviews for homepage
  const homepageReviews = reviews.filter(r => r.isApproved && r.showOnHomepage);

  // Dynamic rating calculation
  const totalReviewsCount = reviews.length;
  const averageRating = totalReviewsCount > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviewsCount).toFixed(1)
    : '4.9';

  // Modal State for user review submission
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorLocation, setAuthorLocation] = useState('');
  const [authorRating, setAuthorRating] = useState(5);
  const [authorComment, setAuthorComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !authorComment.trim()) return;

    try {
      setSubmitting(true);
      const created = await createReviewApi({
        customerName: authorName.trim(),
        customerPhoto: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}`,
        rating: authorRating,
        comment: authorComment.trim(),
        location: authorLocation.trim() || 'Mataram',
        isVerified: true,
        isApproved: true,
        showOnHomepage: true
      });

      onReviewSubmitted(created);
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
        setAuthorName('');
        setAuthorComment('');
        setAuthorLocation('');
        setAuthorRating(5);
      }, 1500);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="review" className="py-20 bg-neutral-900/40 border-t border-neutral-850 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>Testimoni Pelanggan</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-['Outfit'] mb-3">
            KATA MEREKA
          </h2>
          <p className="text-base sm:text-lg text-neutral-400">
            Pengalaman nyata pelanggan sewa PlayStation dan console di Game Master Mataram.
          </p>

          {/* Rating Summary Display */}
          <div className="mt-8 inline-flex items-center gap-6 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-xl">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-2xl font-black text-white font-['Outfit']">
                {averageRating}
              </span>
              <span className="text-sm text-neutral-400 font-semibold">/ 5</span>
            </div>
            <div className="w-px h-8 bg-neutral-800"></div>
            <div className="text-left">
              <span className="text-sm font-bold text-blue-400 block">
                {totalReviewsCount * 25}+ Pelanggan
              </span>
              <span className="text-xs text-neutral-400">Puas di Seluruh Mataram</span>
            </div>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homepageReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 hover:border-blue-500/40 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Rating Stars & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {rev.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified Customer</span>
                    </span>
                  )}
                </div>

                {/* Comment Text */}
                <p className="text-sm text-neutral-300 leading-relaxed italic mb-6">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-850">
                <img
                  src={rev.customerPhoto || '/images/avatar-1.jpg'}
                  alt={rev.customerName}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/avatar-1.jpg';
                  }}
                  className="w-10 h-10 rounded-full object-cover border border-neutral-800 bg-neutral-900"
                />
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {rev.customerName}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                    {rev.location && <span>{rev.location}</span>}
                    <span>•</span>
                    <span>{rev.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* User Review Trigger Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <MessageSquarePlus className="w-4 h-4 text-blue-400" />
            <span>Pernah Sewa di Sini? Tulis Review Kamu</span>
          </button>
        </div>
      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white font-['Outfit']">Tulis Review Anda</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-2">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Terima Kasih!</h4>
                <p className="text-xs text-neutral-400">Review Anda berhasil ditambahkan.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">Lokasi di Mataram (Opsional)</label>
                  <input
                    type="text"
                    value={authorLocation}
                    onChange={(e) => setAuthorLocation(e.target.value)}
                    placeholder="Contoh: Ampenan, Mataram"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">Rating Bintang</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setAuthorRating(num)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            num <= authorRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-neutral-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">Pengalaman Rental</label>
                  <textarea
                    required
                    rows={3}
                    value={authorComment}
                    onChange={(e) => setAuthorComment(e.target.value)}
                    placeholder="Ceritakan kepuasan Anda menyewa di Game Master Mataram..."
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold uppercase text-xs tracking-wider rounded-xl transition-colors shadow-lg shadow-blue-600/30"
                >
                  {submitting ? 'Mengirim...' : 'Kirim Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
