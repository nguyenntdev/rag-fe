import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Landmark,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  MapPin,
  Calendar,
  Award
} from 'lucide-react';

// Import initial data
import initialHeritagesData from '../../data/heritages.json';

const STORAGE_KEY = 'heritage_admin_heritages';

const rankingTypes = [
  { value: 'Quốc gia đặc biệt', label: 'Quốc gia đặc biệt' },
  { value: 'Quốc gia', label: 'Quốc gia' },
  { value: 'Cấp tỉnh', label: 'Cấp tỉnh' },
];

export default function HeritageManagement() {
  const { t } = useTranslation();
  const [heritages, setHeritages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHeritage, setSelectedHeritage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load heritages from localStorage or use initial data
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHeritages(JSON.parse(stored));
      } catch (e) {
        setHeritages(initialHeritagesData || []);
      }
    } else {
      setHeritages(initialHeritagesData || []);
    }
  }, []);

  // Save to localStorage whenever heritages change
  const saveHeritages = (newHeritages) => {
    setHeritages(newHeritages);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHeritages));
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter heritages based on search
  const filteredHeritages = heritages.filter(heritage => {
    const searchLower = searchQuery.toLowerCase();
    return (
      heritage.name?.toLowerCase().includes(searchLower) ||
      heritage.address?.toLowerCase().includes(searchLower) ||
      heritage.rankingType?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredHeritages.length / itemsPerPage);
  const paginatedHeritages = filteredHeritages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle create new
  const handleCreate = () => {
    setFormData({
      id: Date.now(),
      name: '',
      address: '',
      yearRanked: '',
      rankingType: 'Cấp tỉnh',
      yearBuilt: '',
      information: '',
      notes: '',
      audioFile: '',
      image: ''
    });
    setIsCreating(true);
    setIsEditing(false);
    setSelectedHeritage(null);
  };

  // Handle edit
  const handleEdit = (heritage) => {
    setFormData({ ...heritage });
    setIsEditing(true);
    setIsCreating(false);
    setSelectedHeritage(heritage);
  };

  // Handle delete
  const handleDelete = (heritage) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      const newHeritages = heritages.filter(h => h.id !== heritage.id);
      saveHeritages(newHeritages);
      showNotification(t('admin.deleteSuccess'));
    }
  };

  // Handle save
  const handleSave = () => {
    if (!formData.name || !formData.address) {
      showNotification('Vui lòng điền tên và địa chỉ', 'error');
      return;
    }

    let newHeritages;
    if (isCreating) {
      newHeritages = [...heritages, formData];
    } else {
      newHeritages = heritages.map(h => h.id === formData.id ? formData : h);
    }

    saveHeritages(newHeritages);
    showNotification(t('admin.saveSuccess'));
    setIsEditing(false);
    setIsCreating(false);
    setFormData({});
  };

  // Handle cancel
  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setFormData({});
    setSelectedHeritage(null);
  };

  // Handle form change
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
            notification.type === 'success'
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700'
              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-heritage-red-100 dark:bg-heritage-red-900/30 flex items-center justify-center">
            <Landmark className="w-5 h-5 text-heritage-red-600 dark:text-heritage-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-heritage-earth-900 dark:text-gray-100">
              {t('admin.heritageManagement')}
            </h2>
            <p className="text-sm text-heritage-earth-600 dark:text-gray-400">
              {filteredHeritages.length} di sản
            </p>
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-heritage-red-700 dark:bg-heritage-red-600 text-white rounded-xl hover:bg-heritage-red-800 dark:hover:bg-heritage-red-700 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          {t('admin.addNew')}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-heritage-earth-400 dark:text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm di sản..."
          className="w-full pl-12 pr-4 py-3 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-heritage-red-500 focus:border-heritage-red-500 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      {/* Edit/Create Form */}
      {(isEditing || isCreating) && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-heritage-earth-200 dark:border-gray-700 p-6 theme-transition">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-bold text-heritage-earth-900 dark:text-gray-100">
              {isCreating ? 'Thêm di sản mới' : 'Chỉnh sửa di sản'}
            </h3>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-heritage-cream-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-heritage-earth-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                Tên di sản *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleFormChange('name', e.target.value)}
                className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-heritage-red-500 focus:border-heritage-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Nhập tên di sản"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                <MapPin className="inline w-4 h-4 mr-1" />
                Địa chỉ *
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => handleFormChange('address', e.target.value)}
                className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-heritage-red-500 focus:border-heritage-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Nhập địa chỉ"
              />
            </div>

            {/* Year Ranked */}
            <div>
              <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                <Calendar className="inline w-4 h-4 mr-1" />
                Năm xếp hạng
              </label>
              <input
                type="text"
                value={formData.yearRanked || ''}
                onChange={(e) => handleFormChange('yearRanked', e.target.value)}
                className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-heritage-red-500 focus:border-heritage-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="VD: 2015"
              />
            </div>

            {/* Ranking Type */}
            <div>
              <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                <Award className="inline w-4 h-4 mr-1" />
                Loại xếp hạng
              </label>
              <select
                value={formData.rankingType || 'Cấp tỉnh'}
                onChange={(e) => handleFormChange('rankingType', e.target.value)}
                className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-heritage-red-500 focus:border-heritage-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {rankingTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Year Built */}
            <div>
              <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                Năm xây dựng
              </label>
              <input
                type="text"
                value={formData.yearBuilt || ''}
                onChange={(e) => handleFormChange('yearBuilt', e.target.value)}
                className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-heritage-red-500 focus:border-heritage-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="VD: 1890"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                URL hình ảnh
              </label>
              <input
                type="text"
                value={formData.image || ''}
                onChange={(e) => handleFormChange('image', e.target.value)}
                className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-heritage-red-500 focus:border-heritage-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="https://..."
              />
            </div>

            {/* Information */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                Thông tin chi tiết
              </label>
              <textarea
                value={formData.information || ''}
                onChange={(e) => handleFormChange('information', e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-heritage-red-500 focus:border-heritage-red-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Nhập thông tin về di sản..."
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                Ghi chú
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-heritage-red-500 focus:border-heritage-red-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Ghi chú thêm..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-heritage-earth-100 dark:border-gray-700">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-heritage-earth-700 dark:text-gray-300 hover:bg-heritage-cream-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-heritage-red-700 dark:bg-heritage-red-600 text-white rounded-xl hover:bg-heritage-red-800 dark:hover:bg-heritage-red-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              {t('common.save')}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-heritage-earth-200 dark:border-gray-700 overflow-hidden theme-transition">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-heritage-cream-50 dark:bg-gray-700/50 border-b border-heritage-earth-200 dark:border-gray-600">
                <th className="text-left px-4 py-3 text-sm font-semibold text-heritage-earth-700 dark:text-gray-300">
                  Tên di sản
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-heritage-earth-700 dark:text-gray-300 hidden md:table-cell">
                  Địa chỉ
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-heritage-earth-700 dark:text-gray-300 hidden sm:table-cell">
                  Xếp hạng
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-heritage-earth-700 dark:text-gray-300 hidden lg:table-cell">
                  Năm XH
                </th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-heritage-earth-700 dark:text-gray-300">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedHeritages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-heritage-earth-500 dark:text-gray-400">
                    {searchQuery ? 'Không tìm thấy di sản phù hợp' : t('admin.noData')}
                  </td>
                </tr>
              ) : (
                paginatedHeritages.map((heritage, index) => (
                  <tr
                    key={heritage.id || index}
                    className="border-b border-heritage-earth-100 dark:border-gray-700 hover:bg-heritage-cream-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-heritage-earth-900 dark:text-gray-100 line-clamp-1">
                        {heritage.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="text-sm text-heritage-earth-600 dark:text-gray-400 line-clamp-1">
                        {heritage.address}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          heritage.rankingType === 'Quốc gia đặc biệt'
                            ? 'bg-heritage-red-100 dark:bg-heritage-red-900/30 text-heritage-red-700 dark:text-heritage-red-300'
                            : heritage.rankingType === 'Quốc gia'
                            ? 'bg-heritage-gold-100 dark:bg-heritage-gold-900/30 text-heritage-gold-700 dark:text-heritage-gold-300'
                            : 'bg-heritage-earth-100 dark:bg-gray-700 text-heritage-earth-700 dark:text-gray-300'
                        }`}
                      >
                        {heritage.rankingType}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-heritage-earth-600 dark:text-gray-400">
                        {heritage.yearRanked || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(heritage)}
                          className="p-2 hover:bg-heritage-gold-100 dark:hover:bg-heritage-gold-900/30 rounded-lg transition-colors text-heritage-gold-600 dark:text-heritage-gold-400"
                          title={t('admin.editItem')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(heritage)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-600 dark:text-red-400"
                          title={t('admin.deleteItem')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-heritage-earth-100 dark:border-gray-700">
            <div className="text-sm text-heritage-earth-600 dark:text-gray-400">
              Trang {currentPage} / {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 hover:bg-heritage-cream-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 hover:bg-heritage-cream-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
