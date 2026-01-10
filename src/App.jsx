import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import HeritageListPage from './pages/HeritageList';
import QuizPage from './pages/QuizPage';
import TextToSpeechPage from './pages/TTSPage';
import ContributePage from './pages/ContributePage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { ChatPage } from './pages/Chat';
import AdminPage from './pages/admin/AdminPage';
import { PWAPrompt } from './components/PWAPrompt';

// Main App Component - Vietnamese Heritage Theme
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('heritage');
  const { t } = useTranslation();

  const navigateTo = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  // Admin page has its own layout
  if (currentPage === 'admin') {
    return (
      <div className="flex flex-col min-h-screen bg-heritage-cream-50 dark:bg-gray-900 theme-transition">
        {/* Decorative top border */}
        <div className="h-1 bg-gradient-to-r from-heritage-red-700 via-heritage-gold-500 to-heritage-red-700" />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            currentPage={currentPage}
            onNavigate={navigateTo}
          />

          <main className="flex-1 overflow-y-auto scrollbar-heritage">
            <AdminPage />
          </main>
        </div>

        {/* Decorative bottom border */}
        <div className="h-1 bg-gradient-to-r from-heritage-red-700 via-heritage-gold-500 to-heritage-red-700" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-heritage-cream-50 dark:bg-gray-900 theme-transition">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-heritage-red-700 via-heritage-gold-500 to-heritage-red-700" />

      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentPage={currentPage}
          onNavigate={navigateTo}
        />

        <main className="flex-1 overflow-y-auto scrollbar-heritage bg-heritage-cream-50 dark:bg-gray-900 theme-transition">
          <div className="max-w-7xl mx-auto">
            {currentPage === 'heritage' && <HeritageListPage />}
            {currentPage === 'chat' && <ChatPage />}
            {currentPage === 'quiz' && <QuizPage />}
            {currentPage === 'tts' && <TextToSpeechPage />}
            {currentPage === 'contribute' && <ContributePage />}
          </div>
        </main>
      </div>

      <Footer />

      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-heritage-red-700 via-heritage-gold-500 to-heritage-red-700" />

      {/* PWA Install/Update Prompts */}
      <PWAPrompt />
    </div>
  );
}
