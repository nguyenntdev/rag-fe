import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import {
  Landmark,
  Users,
  PartyPopper,
  Brain,
  Volume2,
  Settings,
  LogOut,
  LayoutDashboard,
  ChevronRight,
  TrendingUp,
  Calendar,
  MapPin
} from 'lucide-react';

// Import data for stats
import heritagesData from '../../data/heritages.json';
import { PEOPLE_DATA as peopleData } from '../../data/people.jsx';
import { FESTIVAL_DATA as festivalsData } from '../../data/festivals.jsx';
import { questions as quizData } from '../../data/quiz.jsx';

export default function AdminDashboard({ onNavigate, currentPage }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const stats = [
    {
      id: 'heritages',
      icon: Landmark,
      label: t('admin.totalHeritages'),
      value: heritagesData?.length || 0,
      color: 'heritage-red',
      bgColor: 'bg-heritage-red-100 dark:bg-heritage-red-900/30',
      iconColor: 'text-heritage-red-600 dark:text-heritage-red-400',
    },
    {
      id: 'people',
      icon: Users,
      label: t('admin.totalPeople'),
      value: peopleData?.length || 0,
      color: 'heritage-gold',
      bgColor: 'bg-heritage-gold-100 dark:bg-heritage-gold-900/30',
      iconColor: 'text-heritage-gold-600 dark:text-heritage-gold-400',
    },
    {
      id: 'festivals',
      icon: PartyPopper,
      label: t('admin.totalFestivals'),
      value: festivalsData?.length || 0,
      color: 'heritage-jade',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'quizzes',
      icon: Brain,
      label: t('admin.totalQuizzes'),
      value: quizData?.length || 0,
      color: 'heritage-earth',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
  ];

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('admin.dashboard') },
    { id: 'heritages', icon: Landmark, label: t('admin.heritageManagement') },
    { id: 'people', icon: Users, label: t('admin.peopleManagement') },
    { id: 'festivals', icon: PartyPopper, label: t('admin.festivalManagement') },
    { id: 'quizzes', icon: Brain, label: t('admin.quizManagement') },
    { id: 'audio', icon: Volume2, label: t('admin.audioManagement') },
    { id: 'settings', icon: Settings, label: t('admin.settings') },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-heritage-cream-50 dark:bg-gray-900 theme-transition">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-heritage-red-800 via-heritage-red-700 to-heritage-red-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-heritage-gold-500 flex items-center justify-center shadow-gold">
                <Settings className="w-6 h-6 text-heritage-red-800 dark:text-gray-900" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold">{t('admin.title')}</h1>
                <p className="text-heritage-gold-300 text-sm">
                  {t('admin.welcomeAdmin')} - {user?.username}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-heritage-red-600/50 dark:bg-gray-600/50 hover:bg-heritage-red-600 dark:hover:bg-gray-600 transition-all border border-heritage-gold-400/30 dark:border-gray-500/30"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{t('admin.logout')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-heritage-earth-200 dark:border-gray-700 p-4">
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate?.(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                      currentPage === item.id
                        ? 'bg-heritage-red-100 dark:bg-heritage-red-900/30 text-heritage-red-700 dark:text-heritage-red-300 border-l-4 border-heritage-red-600'
                        : 'hover:bg-heritage-cream-100 dark:hover:bg-gray-700 text-heritage-earth-700 dark:text-gray-300'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {currentPage === item.id && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-heritage-earth-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onNavigate?.(stat.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-3xl font-display font-bold text-heritage-earth-900 dark:text-gray-100 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-heritage-earth-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-heritage-earth-200 dark:border-gray-700 p-6 mb-8">
              <h2 className="text-lg font-display font-bold text-heritage-earth-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-heritage-gold-600" />
                Hành động nhanh
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <button
                  onClick={() => onNavigate?.('heritages')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-heritage-red-50 dark:bg-heritage-red-900/20 hover:bg-heritage-red-100 dark:hover:bg-heritage-red-900/30 transition-colors"
                >
                  <Landmark className="w-8 h-8 text-heritage-red-600 dark:text-heritage-red-400" />
                  <span className="text-sm font-medium text-heritage-earth-700 dark:text-gray-300">
                    {t('admin.addNew')} Di sản
                  </span>
                </button>
                <button
                  onClick={() => onNavigate?.('people')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-heritage-gold-50 dark:bg-heritage-gold-900/20 hover:bg-heritage-gold-100 dark:hover:bg-heritage-gold-900/30 transition-colors"
                >
                  <Users className="w-8 h-8 text-heritage-gold-600 dark:text-heritage-gold-400" />
                  <span className="text-sm font-medium text-heritage-earth-700 dark:text-gray-300">
                    {t('admin.addNew')} Nhân vật
                  </span>
                </button>
                <button
                  onClick={() => onNavigate?.('festivals')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                >
                  <PartyPopper className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-heritage-earth-700 dark:text-gray-300">
                    {t('admin.addNew')} Lễ hội
                  </span>
                </button>
                <button
                  onClick={() => onNavigate?.('quizzes')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                >
                  <Brain className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-medium text-heritage-earth-700 dark:text-gray-300">
                    {t('admin.addNew')} Câu hỏi
                  </span>
                </button>
              </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-heritage-earth-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-display font-bold text-heritage-earth-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-heritage-gold-600" />
                Tổng quan dữ liệu
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-heritage-cream-50 dark:bg-gray-700 border border-heritage-earth-100 dark:border-gray-600">
                  <div className="text-sm text-heritage-earth-600 dark:text-gray-400 mb-1">Xã/Phường</div>
                  <div className="text-2xl font-bold text-heritage-earth-900 dark:text-gray-100">64</div>
                  <div className="text-xs text-heritage-earth-500 dark:text-gray-500 mt-1">55 xã • 9 phường</div>
                </div>
                <div className="p-4 rounded-xl bg-heritage-cream-50 dark:bg-gray-700 border border-heritage-earth-100 dark:border-gray-600">
                  <div className="text-sm text-heritage-earth-600 dark:text-gray-400 mb-1">Di sản Quốc gia đặc biệt</div>
                  <div className="text-2xl font-bold text-heritage-red-700 dark:text-heritage-red-400">1</div>
                  <div className="text-xs text-heritage-earth-500 dark:text-gray-500 mt-1">Căn cứ Cái Chanh</div>
                </div>
                <div className="p-4 rounded-xl bg-heritage-cream-50 dark:bg-gray-700 border border-heritage-earth-100 dark:border-gray-600">
                  <div className="text-sm text-heritage-earth-600 dark:text-gray-400 mb-1">Ngôn ngữ hỗ trợ</div>
                  <div className="text-2xl font-bold text-heritage-earth-900 dark:text-gray-100">4</div>
                  <div className="text-xs text-heritage-earth-500 dark:text-gray-500 mt-1">🇻🇳 🇺🇸 🇨🇳 🇰🇭</div>
                </div>
                <div className="p-4 rounded-xl bg-heritage-cream-50 dark:bg-gray-700 border border-heritage-earth-100 dark:border-gray-600">
                  <div className="text-sm text-heritage-earth-600 dark:text-gray-400 mb-1">Tính năng AI</div>
                  <div className="text-2xl font-bold text-heritage-earth-900 dark:text-gray-100">RAG</div>
                  <div className="text-xs text-heritage-earth-500 dark:text-gray-500 mt-1">LLM Powered Chat</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
