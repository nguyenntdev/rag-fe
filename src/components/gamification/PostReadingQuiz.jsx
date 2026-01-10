import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle, XCircle, ArrowRight, Brain, Sparkles, Award } from 'lucide-react';
import { useGamification, POINTS } from '../../context/GamificationContext';
import { getRandomQuestions } from '../../data/postReadingQuizzes';

/**
 * PostReadingQuiz Component
 * A mini-quiz that appears after viewing heritage details
 * Tests user comprehension and awards bonus points
 */
export function PostReadingQuiz({
  heritageId,
  heritageName,
  isOpen,
  onClose,
  onComplete,
}) {
  const { i18n } = useTranslation();
  const { addPoints, progress } = useGamification();
  const isVietnamese = i18n.language === 'vi';

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Load questions when quiz opens
  useEffect(() => {
    if (isOpen && heritageId) {
      const quizQuestions = getRandomQuestions(heritageId, 2);
      setQuestions(quizQuestions);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setCorrectCount(0);
      setShowResults(false);
    }
  }, [isOpen, heritageId]);

  if (!isOpen || questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswer = (answer) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    const isCorrect = currentQuestion.type === 'true_false'
      ? answer === currentQuestion.correct
      : answer === currentQuestion.correct;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      addPoints(POINTS.POST_QUIZ_CORRECT);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
      onComplete?.(correctCount + (selectedAnswer === currentQuestion.correct ? 1 : 0), questions.length);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  // Render results screen
  if (showResults) {
    const totalCorrect = correctCount;
    const percentage = Math.round((totalCorrect / questions.length) * 100);
    const isPerfect = percentage === 100;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
          {/* Header gradient */}
          <div className="h-1.5 bg-gradient-to-r from-heritage-gold-400 via-heritage-gold-300 to-heritage-gold-400" />

          {/* Content */}
          <div className="p-6 text-center">
            {/* Icon */}
            <div className="mb-4">
              {isPerfect ? (
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <span className="text-4xl">🏆</span>
                </div>
              ) : percentage >= 50 ? (
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-heritage-gold-100 dark:bg-heritage-gold-900/30">
                  <span className="text-4xl">👍</span>
                </div>
              ) : (
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <span className="text-4xl">📚</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-gray-100 mb-2">
              {isPerfect
                ? (isVietnamese ? 'Xuất sắc!' : 'Excellent!')
                : percentage >= 50
                ? (isVietnamese ? 'Làm tốt lắm!' : 'Good job!')
                : (isVietnamese ? 'Tiếp tục cố gắng!' : 'Keep trying!')}
            </h3>

            {/* Score */}
            <p className="text-3xl font-bold text-heritage-red-700 dark:text-heritage-red-400 mb-2">
              {totalCorrect} / {questions.length}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {isVietnamese ? 'câu trả lời đúng' : 'correct answers'}
            </p>

            {/* Points earned */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-heritage-gold-100 dark:bg-heritage-gold-900/30 rounded-full mb-6">
              <Award className="w-4 h-4 text-heritage-gold-600 dark:text-heritage-gold-400" />
              <span className="font-bold text-heritage-gold-700 dark:text-heritage-gold-300">
                +{totalCorrect * POINTS.POST_QUIZ_CORRECT} {isVietnamese ? 'điểm' : 'points'}
              </span>
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="w-full py-3 bg-gradient-to-r from-heritage-red-700 to-heritage-red-800 text-white rounded-xl font-medium hover:from-heritage-red-800 hover:to-heritage-red-900 transition-all"
            >
              {isVietnamese ? 'Đóng' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-heritage-red-700 to-heritage-red-800 p-4">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-heritage-gold-400 via-heritage-gold-300 to-heritage-gold-400" />

          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-heritage-gold-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-heritage-red-800" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isVietnamese ? 'Kiểm tra nhanh' : 'Quick Quiz'}
              </h3>
              <p className="text-heritage-gold-300 text-sm truncate max-w-[200px]">
                {heritageName || (isVietnamese ? 'Di sản văn hóa' : 'Cultural Heritage')}
              </p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-1 mt-3">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  idx < currentIndex
                    ? 'bg-emerald-400'
                    : idx === currentIndex
                    ? 'bg-heritage-gold-400'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question content */}
        <div className="p-6">
          {/* Question number */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {isVietnamese ? 'Câu hỏi' : 'Question'} {currentIndex + 1}/{questions.length}
            </span>
            <Sparkles className="w-4 h-4 text-heritage-gold-500" />
          </div>

          {/* Question text */}
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            {isVietnamese ? currentQuestion.question : currentQuestion.questionEn}
          </h4>

          {/* Answer options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.type === 'true_false' ? (
              <>
                {/* True/False options */}
                {[true, false].map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = currentQuestion.correct === option;
                  const showCorrect = isAnswered && isCorrect;
                  const showIncorrect = isAnswered && isSelected && !isCorrect;

                  return (
                    <button
                      key={String(option)}
                      onClick={() => handleAnswer(option)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-xl text-left font-medium transition-all flex items-center gap-3 ${
                        showCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                          : showIncorrect
                          ? 'bg-red-50 dark:bg-red-900/30 border-2 border-red-400 text-red-800 dark:text-red-200'
                          : isSelected
                          ? 'bg-heritage-gold-50 dark:bg-heritage-gold-900/30 border-2 border-heritage-gold-400'
                          : 'bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-heritage-gold-400 dark:hover:border-heritage-gold-500'
                      } ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <span className="flex-1 text-gray-800 dark:text-gray-200">
                        {option
                          ? (isVietnamese ? 'Đúng' : 'True')
                          : (isVietnamese ? 'Sai' : 'False')}
                      </span>
                      {showCorrect && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                      {showIncorrect && <XCircle className="w-5 h-5 text-red-500" />}
                    </button>
                  );
                })}
              </>
            ) : (
              <>
                {/* Multiple choice options */}
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = currentQuestion.correct === idx;
                  const showCorrect = isAnswered && isCorrect;
                  const showIncorrect = isAnswered && isSelected && !isCorrect;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-xl text-left font-medium transition-all flex items-center gap-3 ${
                        showCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                          : showIncorrect
                          ? 'bg-red-50 dark:bg-red-900/30 border-2 border-red-400 text-red-800 dark:text-red-200'
                          : isSelected
                          ? 'bg-heritage-gold-50 dark:bg-heritage-gold-900/30 border-2 border-heritage-gold-400'
                          : 'bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-heritage-gold-400 dark:hover:border-heritage-gold-500'
                      } ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                        showCorrect
                          ? 'bg-emerald-500 text-white'
                          : showIncorrect
                          ? 'bg-red-500 text-white'
                          : isSelected
                          ? 'bg-heritage-gold-400 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="flex-1 text-gray-800 dark:text-gray-200">
                        {isVietnamese ? option : currentQuestion.optionsEn[idx]}
                      </span>
                      {showCorrect && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                      {showIncorrect && <XCircle className="w-5 h-5 text-red-500" />}
                    </button>
                  );
                })}
              </>
            )}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <div className="bg-heritage-gold-50 dark:bg-heritage-gold-900/20 border-l-4 border-heritage-gold-500 p-4 rounded-r-lg mb-6 animate-fade-in">
              <p className="text-sm font-semibold text-heritage-gold-800 dark:text-heritage-gold-300 mb-1">
                {isVietnamese ? 'Giải thích' : 'Explanation'}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {isVietnamese ? currentQuestion.explanation : currentQuestion.explanationEn}
              </p>
            </div>
          )}

          {/* Next/Finish button */}
          {isAnswered && (
            <button
              onClick={handleNext}
              className="w-full py-3 bg-gradient-to-r from-heritage-red-700 to-heritage-red-800 text-white rounded-xl font-medium hover:from-heritage-red-800 hover:to-heritage-red-900 transition-all flex items-center justify-center gap-2"
            >
              {isLastQuestion
                ? (isVietnamese ? 'Xem kết quả' : 'View Results')
                : (isVietnamese ? 'Câu tiếp theo' : 'Next Question')}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostReadingQuiz;
