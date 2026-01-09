import { Heart, Mail, School, Users, Landmark, MapPin, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 relative">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-heritage-red-700 via-heritage-gold-500 to-heritage-red-700" />

      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Project Info */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-heritage-red-700 flex items-center justify-center shadow-sm border-2 border-heritage-gold-500">
                <Landmark className="w-5 h-5 text-heritage-gold-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {t('footer.projectTitle')}
                </h3>
                <p className="text-xs text-heritage-gold-400 tracking-wide">{t('footer.projectSubtitle')}</p>
              </div>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {t('footer.projectDesc')}
            </p>

            {/* Technology badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-heritage-gold-400 border border-gray-700">
                🤖 {t('footer.ragTech')}
              </span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-heritage-gold-400 border border-gray-700">
                🧠 {t('footer.llmPowered')}
              </span>
            </div>
          </div>

          {/* Team Members */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-heritage-gold-600 flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-bold text-white">
                {t('footer.team')}
              </h3>
            </div>

            <div className="space-y-3">
              {/* Teacher */}
              <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <School className="w-4 h-4 text-heritage-gold-400" />
                  <span className="text-heritage-gold-400 font-semibold text-sm">
                    {t('footer.advisor')}
                  </span>
                </div>
                <p className="text-white font-medium">Lê Nguyễn Thế Bảo</p>
                <p className="text-xs text-gray-400">{t('footer.school')}</p>
              </div>

              {/* Students */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700">
                  <p className="text-xs text-heritage-gold-400 mb-1">{t('footer.student')}</p>
                  <p className="text-white font-medium text-sm">Trương Minh Khiêm</p>
                  <p className="text-xs text-gray-400">12A6</p>
                </div>
                <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700">
                  <p className="text-xs text-heritage-gold-400 mb-1">{t('footer.student')}</p>
                  <p className="text-white font-medium text-sm">Trần Thị Thanh Trúc</p>
                  <p className="text-xs text-gray-400">10A2</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-heritage-red-700 flex items-center justify-center">
                <Mail className="w-4 h-4 text-heritage-gold-400" />
              </div>
              <h3 className="text-base font-bold text-white">
                {t('footer.contact')}
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-center md:justify-end gap-2 text-gray-400">
                <School className="w-4 h-4 text-heritage-gold-500" />
                <span>{t('footer.school')}</span>
              </div>
              <div className="flex items-center justify-center md:justify-end gap-2 text-gray-400">
                <MapPin className="w-4 h-4 text-heritage-gold-500" />
                <span>{t('footer.location')}</span>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-2 py-2">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent" />
              </div>

              <a
                href="mailto:contact@disancamau.vn"
                className="inline-flex items-center gap-2 px-4 py-2 bg-heritage-red-700 hover:bg-heritage-red-600 rounded-lg transition-colors text-white shadow-sm"
              >
                <Mail className="w-4 h-4" />
                <span>{t('footer.contactUs')}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600/30 to-gray-600/30" />
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-heritage-gold-500" />
            <Landmark className="w-4 h-4 text-heritage-gold-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-heritage-gold-500" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-600/30 via-gray-600/30 to-transparent" />
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {t('footer.copyright')}
          </p>
          <p className="text-xs mt-2 text-gray-600 flex items-center justify-center gap-1">
            {t('footer.madeWith').replace('❤️', '')}
            <Heart className="w-3 h-3 text-heritage-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
