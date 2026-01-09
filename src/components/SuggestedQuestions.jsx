import { Sparkles } from 'lucide-react';

export function SuggestedQuestions({ onQuestionClick, disabled }) {
  const questions = [
    'Di tích lịch sử Nọc Nạng là gì?',
    'Sự kiện Nọc Nạng năm 1928 có ý nghĩa như thế nào?',
    'Ông Mười Chức là ai?',
    'Lễ hội Dấu ấn Đồng Nọc Nạng được tổ chức khi nào?'
  ];

  return (
    <div className="mb-4">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-heritage-gold-500" />
        <span className="text-xs font-semibold text-heritage-earth-600 uppercase tracking-wide">
          Câu hỏi gợi ý
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-heritage-gold-300 to-transparent" />
      </div>

      {/* Questions */}
      <div className="flex flex-wrap gap-2">
        {questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onQuestionClick(q)}
            disabled={disabled}
            className={`
              text-xs px-4 py-2.5 rounded-lg font-medium
              transition-all duration-200
              border-2 border-heritage-earth-200
              bg-white text-heritage-earth-700
              hover:border-heritage-gold-400 hover:bg-heritage-gold-50 hover:text-heritage-earth-900
              hover:shadow-sm
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-heritage-earth-200 disabled:hover:bg-white disabled:hover:shadow-none
              group
            `}
          >
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-heritage-cream-100 border border-heritage-earth-200 flex items-center justify-center text-heritage-gold-600 group-hover:bg-heritage-gold-100 group-hover:border-heritage-gold-300 transition-colors">
                {idx + 1}
              </span>
              <span>{q}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
