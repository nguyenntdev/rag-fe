import { useState, useRef } from 'react';
import { Volume2, Pause, Play, Mic, Trash2, Settings, Loader, X } from 'lucide-react';

const SAMPLE_TEXTS = [
    {
        title: 'Về Mũi Cà Mau',
        text: 'Mũi Cà Mau là điểm cực Nam của đất liền Việt Nam, nơi giao thoa giữa biển Đông và vịnh Thái Lan. Đây là vùng đất mũi đầm lầy, có hệ sinh thái rừng ngập mặn phong phú và đa dạng.'
    },
    {
        title: 'Về Công tử Bạc Liêu',
        text: 'Công tử Bạc Liêu tên thật là Trần Trinh Huy, sinh năm 1900 tại Bạc Liêu. Ông nổi tiếng với lối sống xa hoa, phóng khoáng và là biểu tượng của sự giàu có thời Pháp thuộc.'
    },
    {
        title: 'Về Lễ hội Chol Chnam Thmay',
        text: 'Chol Chnam Thmay là Tết truyền thống của người Khmer, diễn ra vào tháng 4 âm lịch. Đây là dịp để cộng đồng người Khmer sum họp, cầu mong một năm mới bình an, phát tài phát lộc.'
    }
];

export default function TextToSpeechPage() {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [voice, setVoice] = useState('vi-VN');
    const [speed, setSpeed] = useState(1.0);

    const audioRef = useRef(null);

    const handleGenerate = async () => {
        if (!text.trim()) {
            setError('Vui lòng nhập văn bản cần chuyển đổi');
            return;
        }

        if (!apiKey.trim()) {
            setError('Vui lòng nhập API Key của Gemini trong phần Cài đặt');
            setShowSettings(true);
            return;
        }

        setIsLoading(true);
        setError('');
        setAudioUrl(null);

        try {
            // Call Gemini API for Text-to-Speech
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `Convert this text to speech in Vietnamese: ${text}`
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                        }
                    })
                }
            );

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();

            // Since Gemini doesn't directly support TTS, we'll use Web Speech API as fallback
            // This is for demo purposes - in production you'd use a proper TTS service
            handleWebSpeechTTS();

        } catch (err) {
            console.error('Error:', err);
            setError('Lỗi khi gọi API. Sử dụng Web Speech API thay thế...');
            // Fallback to Web Speech API
            handleWebSpeechTTS();
        }
    };

    const handleWebSpeechTTS = () => {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            // Try to find Vietnamese voice
            const voices = window.speechSynthesis.getVoices();
            const vietnameseVoice = voices.find(voice =>
                voice.lang.includes('vi') || voice.lang.includes('VN')
            );

            if (vietnameseVoice) {
                utterance.voice = vietnameseVoice;
            }

            utterance.lang = voice;
            utterance.rate = speed;
            utterance.pitch = 1;
            utterance.volume = 1;

            utterance.onstart = () => {
                setIsPlaying(true);
                setIsLoading(false);
            };

            utterance.onend = () => {
                setIsPlaying(false);
            };

            utterance.onerror = (event) => {
                setError('Lỗi khi phát âm thanh: ' + event.error);
                setIsPlaying(false);
                setIsLoading(false);
            };

            window.speechSynthesis.speak(utterance);
            setError('✓ Đang sử dụng Web Speech API của trình duyệt');
        } else {
            setError('Trình duyệt không hỗ trợ Text-to-Speech');
            setIsLoading(false);
        }
    };

    const handlePause = () => {
        if (window.speechSynthesis.speaking) {
            if (isPlaying) {
                window.speechSynthesis.pause();
                setIsPlaying(false);
            } else {
                window.speechSynthesis.resume();
                setIsPlaying(true);
            }
        }
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    const loadSampleText = (sample) => {
        setText(sample.text);
        setError('');
    };

    const clearText = () => {
        setText('');
        setError('');
        handleStop();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-4 lg:p-6 xl:p-8 theme-transition">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                            <Volume2 className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            AI Đọc Văn Bản
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Chuyển đổi văn bản thành giọng nói tự nhiên
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Text Input Area */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 theme-transition">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                    <Mic className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    Văn bản đầu vào
                                </h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowSettings(!showSettings)}
                                        className={`p-2 rounded-lg transition-colors ${
                                            showSettings
                                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400'
                                        }`}
                                        title="Cài đặt"
                                    >
                                        <Settings className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={clearText}
                                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                                        title="Xóa văn bản"
                                    >
                                        <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    </button>
                                </div>
                            </div>

                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Nhập văn bản bạn muốn chuyển thành giọng nói..."
                                className="w-full h-64 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 resize-none text-gray-700 dark:text-gray-200 leading-relaxed bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 theme-transition"
                                disabled={isLoading}
                            />

                            <div className="flex items-center justify-between mt-4">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {text.length} ký tự
                                </span>
                                <button
                                    onClick={handleGenerate}
                                    disabled={isLoading || !text.trim()}
                                    className={`px-8 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105 flex items-center gap-2 ${isLoading || !text.trim()
                                            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg'
                                        }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            <Volume2 className="w-5 h-5" />
                                            Chuyển đổi
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Settings Panel */}
                        {showSettings && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 theme-transition animate-fade-in">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                        <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        Cài đặt
                                    </h3>
                                    <button
                                        onClick={() => setShowSettings(false)}
                                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Gemini API Key
                                        </label>
                                        <input
                                            type="password"
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder="Nhập API key của bạn..."
                                            className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Lấy API key tại: <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">Google AI Studio</a>
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Ngôn ngữ: {voice}
                                        </label>
                                        <select
                                            value={voice}
                                            onChange={(e) => setVoice(e.target.value)}
                                            className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        >
                                            <option value="vi-VN">🇻🇳 Tiếng Việt</option>
                                            <option value="en-US">🇺🇸 English</option>
                                            <option value="zh-CN">🇨🇳 中文</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Tốc độ đọc: {speed}x
                                        </label>
                                        <input
                                            type="range"
                                            min="0.5"
                                            max="2"
                                            step="0.1"
                                            value={speed}
                                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                                            className="w-full accent-purple-600"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            <span>Chậm (0.5x)</span>
                                            <span>Bình thường (1.0x)</span>
                                            <span>Nhanh (2.0x)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error/Success Message */}
                        {error && (
                            <div className={`rounded-xl p-4 ${error.startsWith('✓')
                                    ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300'
                                    : 'bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300'
                                }`}>
                                {error}
                            </div>
                        )}

                        {/* Audio Controls */}
                        {isPlaying && (
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Volume2 className="w-5 h-5" />
                                    Đang phát
                                </h3>
                                <div className="flex items-center justify-center gap-4">
                                    <button
                                        onClick={handlePause}
                                        className="p-4 bg-white/20 hover:bg-white/30 rounded-full transition-all"
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-6 h-6" />
                                        ) : (
                                            <Play className="w-6 h-6" />
                                        )}
                                    </button>
                                    <button
                                        onClick={handleStop}
                                        className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full font-semibold transition-all"
                                    >
                                        Dừng
                                    </button>
                                </div>
                                <div className="mt-4 flex items-center justify-center gap-2">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-1 bg-white rounded-full animate-pulse"
                                                style={{
                                                    height: `${Math.random() * 30 + 10}px`,
                                                    animationDelay: `${i * 0.1}s`
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Sample Texts */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 theme-transition">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                📝 Văn bản mẫu
                            </h3>
                            <div className="space-y-3">
                                {SAMPLE_TEXTS.map((sample, index) => (
                                    <button
                                        key={index}
                                        onClick={() => loadSampleText(sample)}
                                        className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/40 dark:hover:to-pink-900/40 transition-all border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500"
                                    >
                                        <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                                            {sample.title}
                                        </h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                            {sample.text}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-700">
                            <h3 className="text-lg font-bold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
                                💡 Mẹo sử dụng
                            </h3>
                            <ul className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-500">•</span>
                                    <span>Nhập văn bản tiếng Việt để có kết quả tốt nhất</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-500">•</span>
                                    <span>Điều chỉnh tốc độ đọc trong phần Cài đặt</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-500">•</span>
                                    <span>Sử dụng văn bản mẫu để thử nghiệm nhanh</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <audio ref={audioRef} className="hidden" />
        </div>
    );
}
