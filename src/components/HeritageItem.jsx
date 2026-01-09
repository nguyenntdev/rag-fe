import { MapPin, Calendar, Landmark, Award, Star, ChevronRight } from 'lucide-react';

export function HeritageListItem({ item, onClick }) {
  const getRankingStyle = (rankingType) => {
    switch (rankingType?.toLowerCase()) {
      case 'quốc gia đặc biệt':
        return {
          badge: 'bg-heritage-red-100 text-heritage-red-800 border-heritage-red-300',
          accent: 'bg-heritage-red-700',
          icon: <Star className="w-3 h-3" />,
        };
      case 'quốc gia':
        return {
          badge: 'bg-heritage-gold-100 text-heritage-gold-800 border-heritage-gold-300',
          accent: 'bg-heritage-gold-600',
          icon: <Award className="w-3 h-3" />,
        };
      case 'cấp tỉnh':
        return {
          badge: 'bg-heritage-jade-100 text-heritage-jade-800 border-heritage-jade-300',
          accent: 'bg-heritage-jade-600',
          icon: <Landmark className="w-3 h-3" />,
        };
      default:
        return {
          badge: 'bg-heritage-earth-100 text-heritage-earth-700 border-heritage-earth-300',
          accent: 'bg-heritage-earth-500',
          icon: <Landmark className="w-3 h-3" />,
        };
    }
  };

  const style = getRankingStyle(item.rankingType);

  return (
    <div
      onClick={() => onClick(item)}
      className="group bg-white rounded-xl border border-heritage-earth-200 shadow-elegant hover:shadow-elegant-lg transition-all duration-300 cursor-pointer overflow-hidden hover-lift flex"
    >
      {/* Left accent bar */}
      <div className={`w-1.5 ${style.accent} flex-shrink-0`} />

      {/* Image Container */}
      <div className="relative w-36 h-36 flex-shrink-0 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="bg-gradient-to-br from-heritage-cream-100 via-heritage-cream-200 to-heritage-gold-100 h-full flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-heritage-cream-50 flex items-center justify-center shadow-elegant border-2 border-heritage-gold-400">
              <Landmark className="w-6 h-6 text-heritage-red-700" />
            </div>
          </div>
        )}

        {/* Year Built overlay */}
        {item.yearBuilt && (
          <div className="absolute bottom-2 left-2 bg-heritage-earth-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">
            <Calendar className="w-3 h-3 text-heritage-gold-400" />
            <span>{item.yearBuilt}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 min-w-0 flex flex-col justify-between">
        <div>
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-display font-bold text-lg text-heritage-earth-900 group-hover:text-heritage-red-700 transition-colors line-clamp-1">
              {item.name}
            </h3>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 flex-shrink-0 ${style.badge}`}>
              {style.icon}
              <span className="hidden sm:inline">{item.rankingType}</span>
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-heritage-earth-600 mb-2">
            <MapPin className="w-4 h-4 flex-shrink-0 text-heritage-red-600" />
            <span className="truncate">{item.address}</span>
          </div>

          {/* Notes */}
          {item.notes && (
            <p className="text-sm text-heritage-earth-500 line-clamp-1 italic">
              "{item.notes}"
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-heritage-earth-100">
          {item.yearRanked ? (
            <div className="flex items-center gap-1.5 text-xs text-heritage-earth-500">
              <Award className="w-3.5 h-3.5 text-heritage-gold-500" />
              <span>Xếp hạng năm {item.yearRanked}</span>
            </div>
          ) : (
            <div />
          )}

          {/* View more indicator */}
          <div className="flex items-center gap-1 text-xs font-medium text-heritage-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Xem chi tiết</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Decorative corner ornament */}
      <div className="absolute bottom-0 right-0 w-12 h-12 overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute -bottom-6 -right-6 w-12 h-12 border-4 border-heritage-gold-500 rounded-full" />
      </div>
    </div>
  );
}
