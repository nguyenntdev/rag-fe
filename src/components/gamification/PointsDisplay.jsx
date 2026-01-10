import { useGamification } from '../../context/GamificationContext';
import { useTranslation } from 'react-i18next';
import { Star, TrendingUp, Award, Flame } from 'lucide-react';

/**
 * PointsDisplay Component
 * Shows current points, level, and streak
 */
export function PointsDisplay({ compact = false }) {
  const { i18n } = useTranslation();
  const { progress, getCurrentLevel, getProgressToNextLevel } = useGamification();
  const isVietnamese = i18n.language === 'vi';

  const currentLevel = getCurrentLevel();
  const levelProgress = getProgressToNextLevel();

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {/* Points */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-heritage-gold-100 dark:bg-heritage-gold-900/30 rounded-full">
          <Star className="w-4 h-4 text-heritage-gold-600 dark:text-heritage-gold-400" />
          <span className="text-sm font-bold text-heritage-gold-700 dark:text-heritage-gold-300">
            {progress.points.toLocaleString()}
          </span>
        </div>

        {/* Streak */}
        {progress.streakDays > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
              {progress.streakDays}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-4 theme-transition">
      {/* Header with points */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-heritage-gold-100 dark:bg-heritage-gold-900/30 flex items-center justify-center">
            <Star className="w-6 h-6 text-heritage-gold-600 dark:text-heritage-gold-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isVietnamese ? 'Tổng điểm' : 'Total Points'}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {progress.points.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Streak */}
        {progress.streakDays > 0 && (
          <div className="flex flex-col items-center px-4 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
            <Flame className="w-6 h-6 text-orange-500 mb-1" />
            <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {progress.streakDays}
            </span>
            <span className="text-xs text-orange-500 dark:text-orange-400">
              {isVietnamese ? 'ngày' : 'days'}
            </span>
          </div>
        )}
      </div>

      {/* Level progress */}
      <LevelProgress />

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {progress.heritagesViewed?.length || 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isVietnamese ? 'Di sản' : 'Heritages'}
          </p>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {progress.quizzesCompleted?.length || 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isVietnamese ? 'Quiz' : 'Quizzes'}
          </p>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {progress.achievements?.length || 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isVietnamese ? 'Thành tựu' : 'Badges'}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * LevelProgress Component
 * Shows current level and progress to next level
 */
export function LevelProgress({ showLabel = true }) {
  const { i18n } = useTranslation();
  const { progress, getCurrentLevel, getProgressToNextLevel } = useGamification();
  const isVietnamese = i18n.language === 'vi';

  const currentLevel = getCurrentLevel();
  const { next, progress: progressPercent, pointsNeeded } = getProgressToNextLevel();

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-heritage-red-100 dark:bg-heritage-red-900/30 flex items-center justify-center">
              <Award className="w-4 h-4 text-heritage-red-600 dark:text-heritage-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Level {currentLevel.level}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isVietnamese ? currentLevel.name : currentLevel.nameEn}
              </p>
            </div>
          </div>
          {next && (
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isVietnamese ? 'Tiếp theo' : 'Next'}
              </p>
              <p className="text-sm font-medium text-heritage-gold-600 dark:text-heritage-gold-400">
                {isVietnamese ? next.name : next.nameEn}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div className="relative">
        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-heritage-red-600 via-heritage-gold-500 to-heritage-red-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {/* Progress indicator dots */}
        <div className="absolute top-0 left-0 right-0 h-3 flex items-center justify-between px-1">
          {[0, 25, 50, 75, 100].map((marker) => (
            <div
              key={marker}
              className={`w-1.5 h-1.5 rounded-full ${
                progressPercent >= marker
                  ? 'bg-white'
                  : 'bg-gray-300 dark:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Points needed */}
      {next && pointsNeeded > 0 && (
        <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <TrendingUp className="w-3 h-3" />
          <span>
            {pointsNeeded.toLocaleString()} {isVietnamese ? 'điểm nữa' : 'more points'}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * MiniPointsDisplay
 * Minimal points display for headers
 */
export function MiniPointsDisplay() {
  const { progress } = useGamification();

  return (
    <div className="flex items-center gap-1 px-2.5 py-1 bg-heritage-gold-100 dark:bg-heritage-gold-900/30 rounded-full">
      <Star className="w-3.5 h-3.5 text-heritage-gold-600 dark:text-heritage-gold-400" />
      <span className="text-xs font-bold text-heritage-gold-700 dark:text-heritage-gold-300">
        {progress.points >= 1000
          ? `${(progress.points / 1000).toFixed(1)}k`
          : progress.points}
      </span>
    </div>
  );
}

/**
 * StreakDisplay
 * Shows streak with fire animation
 */
export function StreakDisplay({ size = 'normal' }) {
  const { i18n } = useTranslation();
  const { progress } = useGamification();
  const isVietnamese = i18n.language === 'vi';

  if (progress.streakDays === 0) return null;

  if (size === 'small') {
    return (
      <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
        <span className="text-sm">🔥</span>
        <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
          {progress.streakDays}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-xl border border-orange-200 dark:border-orange-800">
      <div className="relative">
        <span className="text-3xl animate-pulse">🔥</span>
        {progress.streakDays >= 7 && (
          <span className="absolute -top-1 -right-1 text-lg">🔥</span>
        )}
      </div>
      <div>
        <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
          {progress.streakDays} {isVietnamese ? 'ngày' : 'days'}
        </p>
        <p className="text-xs text-orange-500 dark:text-orange-400">
          {isVietnamese ? 'Chuỗi liên tiếp' : 'Current streak'}
        </p>
      </div>
    </div>
  );
}

export default PointsDisplay;
