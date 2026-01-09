import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Grid, List, MapPin, Calendar, Landmark, X, Filter, Sparkles, ChevronDown } from 'lucide-react';
import heritageData from '../data/heritages.json' with {"type": "json"}
import { PEOPLE_DATA } from '../data/people';
import { FESTIVAL_DATA } from '../data/festivals';

import { HeritageCard } from '../components/HeritageCard'
import { HeritageListItem } from '../components/HeritageItem';
import { HeritageDetailModal } from '../components/Detail';
import { COMMUNES } from '../data/communes';

function normalizeHeritage(item) {
  return {
    id: Number(item.id),
    name: item.name?.trim() ?? '',
    address: item.address ?? '',
    yearRanked: item.yearRanked ?? null,
    rankingType: item.rankingType ?? 'Unknown',
    yearBuilt: item.yearBuilt ?? null,
    information: item.information ?? '',
    notes: item.notes ?? '',
    audioFile: item.audioFile ?? null,
    image: item.image ?? null
  };
}

const extractCommune = (address) => {
  if (!address) return '';
  const match = address.match(/(xã|phường)\s+([^,]+)/i);
  return match ? `${match[1]} ${match[2]}`.trim() : address;
};

const HERITAGE_DATA = heritageData.map(normalizeHeritage)

export default function HeritageListPage() {
  const { t } = useTranslation();
  const [typeFilter, setTypeFilter] = useState('all');
  const [communeFilter, setCommuneFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // Combine all data
  const allData = useMemo(() => [
    ...HERITAGE_DATA.map(item => ({ ...item, dataType: 'heritage' })),
    ...PEOPLE_DATA.map(item => ({ ...item, dataType: 'people' })),
    ...FESTIVAL_DATA.map(item => ({ ...item, dataType: 'festival' }))
  ], []);

  // Filter data
  const filteredData = useMemo(() => {
    return allData.filter(item => {
      const matchesType = typeFilter === 'all' || item.dataType === typeFilter;

      const itemCommune = extractCommune(item.address);
      const matchesCommune = communeFilter === 'all' ||
        item.address.toLowerCase().includes(communeFilter.toLowerCase()) ||
        itemCommune.toLowerCase().includes(communeFilter.toLowerCase());

      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesType && matchesCommune && matchesSearch;
    });
  }, [allData, typeFilter, communeFilter, searchQuery]);

  // Get communes that have data
  const availableCommunes = useMemo(() => {
    const communesWithData = new Set(
      allData
        .map(item => extractCommune(item.address))
        .filter(Boolean)
    );

    return COMMUNES.filter(commune =>
      communesWithData.has(commune)
    );
  }, [allData]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const clearFilters = () => {
    setTypeFilter('all');
    setCommuneFilter('all');
    setSearchQuery('');
  };

  const hasActiveFilters = typeFilter !== 'all' || communeFilter !== 'all' || searchQuery;

  // Type filter options with translations
  const typeOptions = [
    { value: 'all', label: t('heritage.allTypes') },
    { value: 'heritage', label: t('heritage.heritageType') },
    { value: 'people', label: t('heritage.peopleType') },
    { value: 'festival', label: t('heritage.festivalType') }
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 theme-transition">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-heritage-red-800 via-heritage-red-700 to-heritage-red-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-2xl p-6 sm:p-8 lg:p-10 mb-8 text-white shadow-heritage-lg overflow-hidden">
          {/* Decorative pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-lotus-pattern" />
          </div>

          {/* Gold accent lines */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-heritage-gold-400 via-heritage-gold-300 to-heritage-gold-400" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-heritage-gold-400 via-heritage-gold-300 to-heritage-gold-400" />

          <div className="relative z-10">
            {/* Title */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-heritage-gold-500 flex items-center justify-center shadow-gold">
                  <Landmark className="w-7 h-7 sm:w-8 sm:h-8 text-heritage-red-800" />
                </div>
                <div className="absolute -inset-2 rounded-full border-2 border-heritage-gold-400/50" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white drop-shadow-lg">
                  {t('heritage.title')}
                  <span className="hidden sm:inline text-heritage-gold-300 font-normal text-lg sm:text-xl lg:text-2xl ml-2">
                    — {t('heritage.subtitle')}
                  </span>
                </h1>
                <p className="sm:hidden text-heritage-gold-300 text-sm mt-1">
                  {t('heritage.subtitle')}
                </p>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-heritage-cream-100/90 mb-6 max-w-2xl text-sm sm:text-base">
              {t('common.all') === 'All'
                ? 'Explore historical sites, culture, figures and traditional festivals of 55 communes and 9 wards'
                : 'Khám phá di tích lịch sử, văn hóa, nhân vật và lễ hội truyền thống của 55 xã và 9 phường'}
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('heritage.searchPlaceholder')}
                className="w-full px-5 py-3.5 pl-12 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-heritage-gold-400 shadow-md placeholder-gray-400 dark:placeholder-gray-500 border border-heritage-gold-200 dark:border-gray-600"
              />
              <Search className="absolute left-4 top-4.5 w-5 h-5 text-heritage-earth-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-4 p-1 hover:bg-heritage-earth-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-heritage-earth-500" />
                </button>
              )}
            </div>
          </div>

          {/* Decorative corner elements */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-heritage-gold-400 animate-pulse" />
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 mb-6 theme-transition">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-heritage-red-700 dark:text-heritage-red-400" />
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('heritage.filterSection')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('heritage.typeFilter')}
              </label>
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-heritage-gold-500 focus:ring-2 focus:ring-heritage-gold-100 dark:focus:ring-heritage-gold-900/50 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 appearance-none cursor-pointer transition-colors hover:border-gray-400 dark:hover:border-gray-500"
                >
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-heritage-earth-400 dark:text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Commune Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('heritage.communeFilter')} ({t('heritage.communeCount')})
              </label>
              <div className="relative">
                <select
                  value={communeFilter}
                  onChange={(e) => setCommuneFilter(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-heritage-gold-500 focus:ring-2 focus:ring-heritage-gold-100 dark:focus:ring-heritage-gold-900/50 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 appearance-none cursor-pointer transition-colors hover:border-gray-400 dark:hover:border-gray-500"
                >
                  <option value="all">{t('heritage.allCommunes')}</option>
                  <optgroup label={t('common.all') === 'All' ? 'With data' : 'Có dữ liệu'}>
                    {availableCommunes.map(commune => (
                      <option key={commune} value={commune}>
                        {commune.startsWith('Phường') ? '🏙️' : '🏘️'} {commune}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-heritage-earth-400 dark:text-gray-400 pointer-events-none" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                {t('heritage.showingCommunes', { count: availableCommunes.length })}
              </p>
            </div>

            {/* View Mode Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('heritage.viewMode')}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${viewMode === 'grid'
                    ? 'bg-heritage-red-700 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                >
                  <Grid className="w-4 h-4" />
                  <span>{t('heritage.gridView')}</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${viewMode === 'list'
                    ? 'bg-heritage-red-700 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                >
                  <List className="w-4 h-4" />
                  <span>{t('heritage.listView')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center gap-1">
                <Filter className="w-4 h-4" />
                {t('heritage.activeFilters')}:
              </span>
              {typeFilter !== 'all' && (
                <span className="px-3 py-1.5 bg-heritage-gold-100 dark:bg-heritage-gold-900/50 text-heritage-gold-800 dark:text-heritage-gold-200 rounded-full text-sm font-medium flex items-center gap-1.5 border border-heritage-gold-200 dark:border-heritage-gold-700">
                  {typeFilter === 'heritage' ? `🏛️ ${t('heritage.heritageType')}` : typeFilter === 'people' ? `👤 ${t('heritage.peopleType')}` : `🎉 ${t('heritage.festivalType')}`}
                  <button onClick={() => setTypeFilter('all')} className="hover:bg-heritage-gold-200 rounded-full p-0.5 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {communeFilter !== 'all' && (
                <span className="px-3 py-1.5 bg-heritage-red-100 dark:bg-heritage-red-900/50 text-heritage-red-800 dark:text-heritage-red-200 rounded-full text-sm font-medium flex items-center gap-1.5 border border-heritage-red-200 dark:border-heritage-red-700">
                  <MapPin className="w-3.5 h-3.5" />
                  {communeFilter}
                  <button onClick={() => setCommuneFilter('all')} className="hover:bg-heritage-red-200 dark:hover:bg-heritage-red-800 rounded-full p-0.5 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium flex items-center gap-1.5 border border-gray-200 dark:border-gray-600">
                  🔍 "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-0.5 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 bg-gray-800 dark:bg-gray-600 text-white rounded-full text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-500 flex items-center gap-1.5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                {t('heritage.clearAll')}
              </button>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6 theme-transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="text-center px-3 sm:px-4 py-2 bg-heritage-red-50 dark:bg-heritage-red-900/30 rounded-lg border border-heritage-red-100 dark:border-heritage-red-800">
                <div className="text-xl sm:text-2xl font-bold text-heritage-red-700 dark:text-heritage-red-400">{filteredData.length}</div>
                <div className="text-xs text-heritage-red-600 dark:text-heritage-red-300 font-medium">{t('heritage.results')}</div>
              </div>
              <div className="text-center px-3 sm:px-4 py-2 bg-heritage-gold-50 dark:bg-heritage-gold-900/30 rounded-lg border border-heritage-gold-100 dark:border-heritage-gold-800">
                <div className="text-xl sm:text-2xl font-bold text-heritage-gold-700 dark:text-heritage-gold-400">64</div>
                <div className="text-xs text-heritage-gold-600 dark:text-heritage-gold-300 font-medium">{t('heritage.communes')}</div>
              </div>
              <div className="hidden sm:block text-center px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
                <div className="text-2xl font-bold text-gray-700 dark:text-gray-200">{allData.length}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">{t('heritage.totalHeritage')}</div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Landmark className="w-4 h-4 text-heritage-gold-500" />
              <span>{t('heritage.communeStat')}</span>
            </div>
          </div>
        </div>

        {/* Heritage Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map(item => (
              <HeritageCard
                key={`${item.dataType}-${item.id}`}
                item={item}
                onClick={handleItemClick}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredData.map(item => (
              <HeritageListItem
                key={`${item.dataType}-${item.id}`}
                item={item}
                onClick={handleItemClick}
              />
            ))}
          </div>
        )}

        {selectedItem && (
          <HeritageDetailModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 theme-transition">
            {/* Decorative element */}
            <div className="relative inline-block mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t('heritage.noResults')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {communeFilter !== 'all'
                ? t('heritage.noDataFor', { commune: communeFilter })
                : t('heritage.tryDifferent')}
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 bg-heritage-red-700 text-white rounded-lg font-medium hover:bg-heritage-red-800 transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              {t('heritage.resetFilters')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
