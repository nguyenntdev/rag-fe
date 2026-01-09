import { MapPin, Calendar, Landmark, Award, Star } from 'lucide-react';

export function HeritageCard({ item, onClick }) {
  const getRankingStyle = (rankingType) => {
    switch (rankingType?.toLowerCase()) {
      case 'quốc gia đặc biệt':
        return {
          badge: 'bg-heritage-red-100 dark:bg-heritage-red-900/50 text-heritage-red-800 dark:text-heritage-red-200 border-heritage-red-300 dark:border-heritage-red-700',
          accent: 'from-heritage-red-600 to-heritage-red-700',
          icon: <Star className="w-3 h-3" />,
        };
      case 'quốc gia':
        return {
          badge: 'bg-heritage-gold-100 dark:bg-heritage-gold-900/50 text-heritage-gold-800 dark:text-heritage-gold-200 border-heritage-gold-300 dark:border-heritage-gold-700',
          accent: 'from-heritage-gold-500 to-heritage-gold-600',
          icon: <Award className="w-3 h-3" />,
        };
      case 'cấp tỉnh':
        return {
          badge: 'bg-heritage-jade-100 dark:bg-emerald-900/50 text-heritage-jade-800 dark:text-emerald-200 border-heritage-jade-300 dark:border-emerald-700',
          accent: 'from-heritage-jade-500 to-heritage-jade-600',
          icon: <Landmark className="w-3 h-3" />,
        };
      default:
        return {
          badge: 'bg-heritage-earth-100 dark:bg-gray-700 text-heritage-earth-700 dark:text-gray-300 border-heritage-earth-300 dark:border-gray-600',
          accent: 'from-heritage-earth-400 to-heritage-earth-500',
          icon: <Landmark className="w-3 h-3" />,
        };
    }
  };

  const style = getRankingStyle(item.rankingType);

  return (
    <div
      onClick={() => onClick(item)}
      className="group bg-white dark:bg-gray-800 rounded-xl border border-heritage-earth-200 dark:border-gray-700 shadow-elegant hover:shadow-elegant-lg transition-all duration-300 cursor-pointer overflow-hidden hover-lift theme-transition"
    >
      {/* Decorative top accent */}
      <div className={`h-1.5 bg-gradient-to-r ${style.accent}`} />

      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="bg-gradient-to-br from-heritage-cream-100 via-heritage-cream-200 to-heritage-gold-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full border-2 border-heritage-gold-300 dark:border-heritage-gold-600 opacity-50" />
              <div className="w-16 h-16 rounded-full bg-heritage-cream-50 dark:bg-gray-800 flex items-center justify-center shadow-elegant border-2 border-heritage-gold-400 dark:border-heritage-gold-600">
                <Landmark className="w-8 h-8 text-heritage-red-700 dark:text-heritage-red-400" />
              </div>
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Ranking Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${style.badge} shadow-sm flex items-center gap-1.5`}>
            {style.icon}
            {item.rankingType}
          </span>
        </div>

        {/* Year Built Badge */}
        {item.yearBuilt && (
          <div className="absolute bottom-3 left-3 bg-heritage-earth-900/80 dark:bg-gray-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Calendar className="w-3 h-3 text-heritage-gold-400" />
            <span>Xây dựng: {item.yearBuilt}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-display font-bold text-lg text-heritage-earth-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-heritage-red-700 dark:group-hover:text-heritage-red-400 transition-colors">
          {item.name}
        </h3>

        {/* Location */}
        <div className="flex items-start gap-2 text-sm text-heritage-earth-600 dark:text-gray-400 mb-3">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-heritage-red-600 dark:text-heritage-red-400" />
          <span className="line-clamp-2">{item.address}</span>
        </div>

        {/* Notes */}
        {item.notes && (
          <p className="text-sm text-heritage-earth-500 dark:text-gray-500 mb-3 line-clamp-2 italic">
            "{item.notes}"
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-heritage-earth-100 dark:border-gray-700">
          {item.yearRanked ? (
            <div className="flex items-center gap-1.5 text-xs text-heritage-earth-500 dark:text-gray-400">
              <Award className="w-3.5 h-3.5 text-heritage-gold-500" />
              <span>Xếp hạng năm {item.yearRanked}</span>
            </div>
          ) : (
            <div />
          )}

          {/* View more indicator */}
          <div className="text-xs font-medium text-heritage-red-600 dark:text-heritage-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <span>Xem chi tiết</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>

      {/* Decorative corner ornament */}
      <div className="absolute bottom-0 right-0 w-16 h-16 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -bottom-8 -right-8 w-16 h-16 border-4 border-heritage-gold-500 rounded-full" />
      </div>
    </div>
  );
}
