import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Brain,
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
  HelpCircle,
  Check
} from 'lucide-react';

// Import initial data
import { questions as initialQuizData } from '../../data/quiz.jsx';

const STORAGE_KEY = 'heritage_admin_quiz';

export default function QuizManager({ onBack }) {
  const { t } = useTranslation();
  const [quizzes, setQuizzes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load quizzes from localStorage or use initial data
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setQuizzes(JSON.parse(stored));
      } catch (e) {
        setQuizzes(initialQuizData || []);
      }
    } else {
      setQuizzes(initialQuizData || []);
    }
  }, []);

  // Save to localStorage whenever quizzes change
  const saveQuizzes = (newQuizzes) => {
    setQuizzes(newQuizzes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newQuizzes));
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter quizzes based on search
  const filteredQuizzes = quizzes.filter(quiz => {
    const searchLower = searchQuery.toLowerCase();
    return (
      quiz.question?.toLowerCase().includes(searchLower) ||
      quiz.options?.some(opt => opt?.toLowerCase().includes(searchLower))
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle create new
  const handleCreate = () => {
    setFormData({
      id: Date.now(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
    setIsCreating(true);
    setIsEditing(false);
  };

  // Handle edit
  const handleEdit = (quiz) => {
    // Ensure options array has 4 elements
    const options = quiz.options || ['', '', '', ''];
    while (options.length < 4) options.push('');
    setFormData({ ...quiz, options });
    setIsEditing(true);
    setIsCreating(false);
  };

  // Handle delete
  const handleDelete = (quiz) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      const newQuizzes = quizzes.filter(q => q.id !== quiz.id);
      saveQuizzes(newQuizzes);
      showNotification(t('admin.deleteSuccess'));
    }
  };

  // Handle save
  const handleSave = () => {
    if (!formData.question || !formData.options[0]) {
      showNotification('Vui lòng điền câu hỏi và ít nhất 1 đáp án', 'error');
      return;
    }

    // Filter out empty options
    const validOptions = formData.options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      showNotification('Cần ít nhất 2 đáp án', 'error');
      return;
    }

    const dataToSave = {
      ...formData,
      options: validOptions,
      correctAnswer: Math.min(formData.correctAnswer, validOptions.length - 1)
    };

    let newQuizzes;
    if (isCreating) {
      newQuizzes = [...quizzes, dataToSave];
    } else {
      newQuizzes = quizzes.map(q => q.id === dataToSave.id ? dataToSave : q);
    }

    saveQuizzes(newQuizzes);
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
  };

  // Handle form change
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle option change
  const handleOptionChange = (index, value) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  return (
    <div className="min-h-screen bg-heritage-cream-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Notification */}
        {notification && (
          <div
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
              notification.type === 'success'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-red-100 text-red-800 border border-red-200'
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
            <button
              onClick={onBack}
              className="p-2 hover:bg-heritage-cream-200 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Brain className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-heritage-earth-900">
                {t('admin.quizManagement')}
              </h2>
              <p className="text-sm text-heritage-earth-600">
                {filteredQuizzes.length} câu hỏi
              </p>
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            {t('admin.addNew')}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-heritage-earth-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm câu hỏi..."
            className="w-full pl-12 pr-4 py-3 border border-heritage-earth-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white"
          />
        </div>

        {/* Edit/Create Form */}
        {(isEditing || isCreating) && (
          <div className="bg-white rounded-2xl shadow-elegant border border-heritage-earth-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-bold text-heritage-earth-900">
                {isCreating ? 'Thêm câu hỏi mới' : 'Chỉnh sửa câu hỏi'}
              </h3>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-heritage-cream-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-heritage-earth-600" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Question */}
              <div>
                <label className="block text-sm font-medium text-heritage-earth-700 mb-1.5">
                  <HelpCircle className="inline w-4 h-4 mr-1" />
                  Câu hỏi *
                </label>
                <textarea
                  value={formData.question || ''}
                  onChange={(e) => handleFormChange('question', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-heritage-earth-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                  placeholder="Nhập câu hỏi..."
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-heritage-earth-700 mb-2">
                  Các đáp án (chọn đáp án đúng)
                </label>
                <div className="space-y-2">
                  {(formData.options || ['', '', '', '']).map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleFormChange('correctAnswer', index)}
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          formData.correctAnswer === index
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-heritage-earth-300 hover:border-heritage-earth-400'
                        }`}
                        title={formData.correctAnswer === index ? 'Đáp án đúng' : 'Đặt làm đáp án đúng'}
                      >
                        {formData.correctAnswer === index ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-medium text-heritage-earth-500">
                            {String.fromCharCode(65 + index)}
                          </span>
                        )}
                      </button>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-heritage-earth-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder={`Đáp án ${String.fromCharCode(65 + index)}`}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-heritage-earth-500 mt-2">
                  Nhấn vào chữ cái để đánh dấu đáp án đúng
                </p>
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-sm font-medium text-heritage-earth-700 mb-1.5">
                  Giải thích (hiển thị sau khi trả lời)
                </label>
                <textarea
                  value={formData.explanation || ''}
                  onChange={(e) => handleFormChange('explanation', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-heritage-earth-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                  placeholder="Nhập giải thích cho đáp án đúng..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-heritage-earth-100">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-heritage-earth-700 hover:bg-heritage-cream-100 rounded-xl transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                {t('common.save')}
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-elegant border border-heritage-earth-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-heritage-cream-50 border-b border-heritage-earth-200">
                  <th className="text-left px-4 py-3 text-sm font-semibold text-heritage-earth-700 w-12">
                    #
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-heritage-earth-700">
                    Câu hỏi
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-heritage-earth-700 hidden sm:table-cell">
                    Số đáp án
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-heritage-earth-700">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedQuizzes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-heritage-earth-500">
                      {searchQuery ? 'Không tìm thấy câu hỏi phù hợp' : t('admin.noData')}
                    </td>
                  </tr>
                ) : (
                  paginatedQuizzes.map((quiz, index) => (
                    <tr
                      key={quiz.id || index}
                      className="border-b border-heritage-earth-100 hover:bg-heritage-cream-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-heritage-earth-500">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-heritage-earth-900 line-clamp-2">
                          {quiz.question}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                          {quiz.options?.length || 0} đáp án
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(quiz)}
                            className="p-2 hover:bg-heritage-gold-100 rounded-lg transition-colors text-heritage-gold-600"
                            title={t('admin.editItem')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(quiz)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
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
            <div className="flex items-center justify-between px-4 py-3 border-t border-heritage-earth-100">
              <div className="text-sm text-heritage-earth-600">
                Trang {currentPage} / {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-heritage-cream-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 hover:bg-heritage-cream-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
