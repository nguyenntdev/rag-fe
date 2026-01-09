import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, RotateCcw, ArrowRight, Sparkles, CheckCircle, XCircle, Landmark, Award, Brain } from 'lucide-react';
import { questions } from '../data/quiz';

export default function QuizPage() {
  const { t } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const handleAnswer = (index) => {
    if (answered) return;

    setSelectedAnswer(index);
    setAnswered(true);

    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setSpinning(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
      setSpinning(false);
    }, 600);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswered(false);
    setSpinning(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return t('quiz.excellentMsg');
    if (percentage >= 80) return t('quiz.goodMsg');
    if (percentage >= 60) return t('quiz.fairMsg');
    if (percentage >= 40) return t('quiz.averageMsg');
    return t('quiz.needImprovementMsg');
  };

  const getScoreGrade = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return { label: t('quiz.excellent'), color: 'text-heritage-gold-600 dark:text-heritage-gold-400' };
    if (percentage >= 80) return { label: t('quiz.good'), color: 'text-emerald-600 dark:text-emerald-400' };
    if (percentage >= 60) return { label: t('quiz.fair'), color: 'text-heritage-gold-700 dark:text-heritage-gold-400' };
    if (percentage >= 40) return { label: t('quiz.average'), color: 'text-gray-600 dark:text-gray-400' };
    return { label: t('quiz.needImprovement'), color: 'text-heritage-red-600 dark:text-heritage-red-400' };
  };

  // Result Screen
  if (showResult) {
    const grade = getScoreGrade();
    return (
      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[80vh]">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 sm:p-10 max-w-lg w-full text-center overflow-hidden theme-transition">
          {/* Decorative top border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-heritage-red-700 via-heritage-gold-500 to-heritage-red-700" />

          {/* Trophy Icon */}
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 rounded-full bg-heritage-gold-100 dark:bg-heritage-gold-900/30 flex items-center justify-center border-4 border-heritage-gold-400 dark:border-heritage-gold-600 shadow-md">
              <Trophy className="w-10 h-10 text-heritage-gold-600 dark:text-heritage-gold-400" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t('quiz.result')}
          </h2>
          <p className={`text-lg font-semibold ${grade.color} mb-6`}>
            {grade.label}
          </p>

          {/* Score */}
          <div className="relative inline-block mb-6">
            <div className="text-5xl font-bold text-heritage-red-700 dark:text-heritage-red-400">
              {score}
              <span className="text-2xl text-gray-400 dark:text-gray-500">/{questions.length}</span>
            </div>
          </div>

          {/* Message */}
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            {getScoreMessage()}
          </p>

          {/* Progress visualization */}
          <div className="mb-8">
            <div className="flex justify-center gap-1.5 mb-2">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full ${
                    idx < score
                      ? 'bg-emerald-500'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('quiz.correctAnswers', { score, total: questions.length })}
            </p>
          </div>

          {/* Restart Button */}
          <button
            onClick={resetQuiz}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-heritage-red-700 to-heritage-red-800 text-white rounded-xl font-medium hover:from-heritage-red-800 hover:to-heritage-red-900 transition-all shadow-md"
          >
            <RotateCcw className="w-5 h-5" />
            {t('quiz.playAgain')}
          </button>

          {/* Decorative corner elements */}
          <div className="absolute bottom-4 right-4 opacity-10 dark:opacity-5">
            <Landmark className="w-16 h-16 text-heritage-gold-600" />
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  return (
    <div className="flex items-center justify-center p-3 sm:p-4 lg:p-6 xl:p-8 min-h-[80vh]">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-heritage-gold-500 flex items-center justify-center shadow-md">
                <Brain className="w-6 h-6 text-heritage-red-800 dark:text-gray-900" />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {t('quiz.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('quiz.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6 overflow-hidden relative theme-transition">
          {/* Decorative top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-heritage-red-600 via-heritage-gold-500 to-heritage-red-600" />

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-heritage-red-100 dark:bg-heritage-red-900/30 flex items-center justify-center border border-heritage-red-200 dark:border-heritage-red-700">
                <span className="text-heritage-red-700 dark:text-heritage-red-400 font-bold">{currentQuestion + 1}</span>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('quiz.question')} {currentQuestion + 1} / {questions.length}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-heritage-gold-50 dark:bg-heritage-gold-900/30 rounded-lg border border-heritage-gold-200 dark:border-heritage-gold-700">
              <Award className="w-4 h-4 text-heritage-gold-600 dark:text-heritage-gold-400" />
              <span className="text-sm font-semibold text-heritage-gold-700 dark:text-heritage-gold-300">
                {t('quiz.score')}: {score}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-heritage-red-600 via-heritage-gold-500 to-heritage-red-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mt-3">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx < currentQuestion
                    ? 'bg-emerald-500'
                    : idx === currentQuestion
                    ? 'bg-heritage-gold-500'
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div
          className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-all duration-500 overflow-hidden theme-transition ${
            spinning ? 'animate-pulse scale-95 opacity-50' : 'scale-100 opacity-100'
          }`}
        >
          {/* Decorative top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-heritage-red-700 via-heritage-gold-500 to-heritage-red-700" />

          {/* Question */}
          <div className="mb-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-heritage-red-100 dark:bg-heritage-red-900/30 flex items-center justify-center flex-shrink-0 border border-heritage-red-200 dark:border-heritage-red-700">
                <Sparkles className="w-4 h-4 text-heritage-red-600 dark:text-heritage-red-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
                {questions[currentQuestion].question}
              </h2>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {questions[currentQuestion].options.map((option, index) => {
              const isCorrect = index === questions[currentQuestion].correct;
              const isSelected = index === selectedAnswer;

              let buttonClass = `
                w-full p-4 sm:p-5 rounded-xl text-left font-medium transition-all duration-200
                flex items-center gap-4 group
              `;

              let iconContent = null;

              if (answered) {
                if (isCorrect) {
                  buttonClass += ' bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-500 dark:border-emerald-600 text-emerald-800 dark:text-emerald-200';
                  iconContent = <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
                } else if (isSelected) {
                  buttonClass += ' bg-red-50 dark:bg-red-900/30 border-2 border-red-400 dark:border-red-600 text-red-800 dark:text-red-200';
                  iconContent = <XCircle className="w-6 h-6 text-red-500 dark:text-red-400" />;
                } else {
                  buttonClass += ' bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400';
                }
              } else {
                buttonClass += ' bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-heritage-gold-400 dark:hover:border-heritage-gold-500 hover:bg-heritage-gold-50 dark:hover:bg-heritage-gold-900/20 hover:shadow-sm cursor-pointer';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={answered}
                  className={buttonClass}
                >
                  {/* Option letter */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                        answered
                          ? isCorrect
                            ? 'bg-emerald-500 text-white'
                            : isSelected
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                          : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 group-hover:bg-heritage-gold-400 group-hover:text-white'
                      }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>

                  {/* Option text */}
                  <span className="flex-1 text-base sm:text-lg">{option}</span>

                  {/* Result icon */}
                  {answered && iconContent}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answered && (
            <div className="bg-heritage-gold-50 dark:bg-heritage-gold-900/20 border-l-4 border-heritage-gold-500 p-4 rounded-r-lg mb-6 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-heritage-gold-100 dark:bg-heritage-gold-900/50 flex items-center justify-center flex-shrink-0">
                  <Landmark className="w-4 h-4 text-heritage-gold-600 dark:text-heritage-gold-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-heritage-gold-800 dark:text-heritage-gold-300 mb-1">{t('quiz.explanation')}</p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {questions[currentQuestion].explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Next Button */}
          {answered && (
            <button
              onClick={nextQuestion}
              className="w-full bg-gradient-to-r from-heritage-red-700 to-heritage-red-800 text-white py-3.5 rounded-xl font-medium text-lg hover:from-heritage-red-800 hover:to-heritage-red-900 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              {currentQuestion < questions.length - 1 ? (
                <>
                  {t('quiz.nextQuestion')}
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  {t('quiz.viewResult')}
                  <Trophy className="w-5 h-5" />
                </>
              )}
            </button>
          )}

          {/* Decorative corner ornament */}
          <div className="absolute bottom-4 right-4 opacity-10 dark:opacity-5 pointer-events-none">
            <div className="w-20 h-20 border-4 border-heritage-gold-500 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
