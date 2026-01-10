import { useState, useRef, useEffect } from 'react';
import { X, MapPin, Calendar, Info, Volume2, Pause, Play, Loader, Landmark, Award, Star, Sparkles } from 'lucide-react';

export function HeritageDetailModal({ item, onClose }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [audioError, setAudioError] = useState(false);
    const audioRef = useRef(null);

    // Parse information field to separate text and images
    const parseInformation = (info) => {
        if (!info) return { sections: [] };

        // Use a non-capturing group for the file extension
        const urlRegex = /https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|JPG|JPEG|PNG|GIF|WEBP)/gi;
        const sections = [];
        let lastIndex = 0;
        let match;

        // Find all image URLs
        while ((match = urlRegex.exec(info)) !== null) {
            // Add text before the image URL
            const textBefore = info.substring(lastIndex, match.index).trim();
            if (textBefore) {
                sections.push({ type: 'text', content: textBefore });
            }

            // Add the image URL
            sections.push({ type: 'image', content: match[0] });

            lastIndex = match.index + match[0].length;
        }

        // Add any remaining text after the last image
        const remainingText = info.substring(lastIndex).trim();
        if (remainingText) {
            sections.push({ type: 'text', content: remainingText });
        }

        return { sections };
    };

    const informationData = parseInformation(item.information);

    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    const handlePlayAudio = async () => {
        if (!item.audioFile) {
            setAudioError(true);
            return;
        }

        if (!audioRef.current) return;

        // If audio is already loaded and ready
        if (audioRef.current.src && !audioRef.current.paused) {
            audioRef.current.pause();
            setIsPlaying(false);
            return;
        }

        if (audioRef.current.src && audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
            return;
        }

        // Load audio file
        setIsLoading(true);
        setAudioError(false);

        try {
            // Import the audio file dynamically
            const audioModule = await import(`../audio/${item.audioFile}`);
            audioRef.current.src = audioModule.default;

            audioRef.current.onloadeddata = () => {
                setIsLoading(false);
                audioRef.current.play();
                setIsPlaying(true);
            };

            audioRef.current.onended = () => {
                setIsPlaying(false);
            };

            audioRef.current.onerror = () => {
                setAudioError(true);
                setIsPlaying(false);
                setIsLoading(false);
            };
        } catch (error) {
            console.error('Error loading audio:', error);
            setAudioError(true);
            setIsLoading(false);
        }
    };

    const handleStopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    const getRankingStyle = (rankingType) => {
        switch (rankingType?.toLowerCase()) {
            case 'quốc gia đặc biệt':
                return {
                    badge: 'bg-heritage-red-100 text-heritage-red-800 border-heritage-red-300',
                    gradient: 'from-heritage-red-700 via-heritage-red-600 to-heritage-red-700',
                    icon: <Star className="w-4 h-4" />,
                };
            case 'quốc gia':
                return {
                    badge: 'bg-heritage-gold-100 text-heritage-gold-800 border-heritage-gold-300',
                    gradient: 'from-heritage-gold-600 via-heritage-gold-500 to-heritage-gold-600',
                    icon: <Award className="w-4 h-4" />,
                };
            case 'cấp tỉnh':
                return {
                    badge: 'bg-heritage-jade-100 text-heritage-jade-800 border-heritage-jade-300',
                    gradient: 'from-heritage-jade-600 via-heritage-jade-500 to-heritage-jade-600',
                    icon: <Landmark className="w-4 h-4" />,
                };
            default:
                return {
                    badge: 'bg-heritage-earth-100 text-heritage-earth-700 border-heritage-earth-300',
                    gradient: 'from-heritage-earth-500 to-heritage-earth-600',
                    icon: <Landmark className="w-4 h-4" />,
                };
        }
    };

    const style = getRankingStyle(item.rankingType);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-heritage-earth-950/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant-lg max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scale-in border border-heritage-earth-200 dark:border-gray-700">
                {/* Decorative top border */}
                <div className="h-1.5 bg-gradient-to-r from-heritage-red-700 via-heritage-gold-500 to-heritage-red-700" />

                {/* Header with Hero Image */}
                <div className="relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2.5 rounded-full bg-heritage-earth-900/70 hover:bg-heritage-earth-900 transition-colors z-10 text-white border border-heritage-gold-400/30"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Hero Image */}
                    <div className="relative h-72 overflow-hidden">
                        {item.image ? (
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className={`bg-gradient-to-br ${style.gradient} h-full flex items-center justify-center relative overflow-hidden`}>
                                {/* Pattern overlay */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute inset-0 bg-lotus-pattern" />
                                </div>
                                <div className="relative">
                                    <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                                        <Landmark className="w-14 h-14 text-white" />
                                    </div>
                                    <div className="absolute -inset-4 rounded-full border-2 border-white/20" />
                                </div>
                            </div>
                        )}
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-heritage-earth-950/80 via-heritage-earth-950/30 to-transparent" />

                        {/* Gold accent line */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-heritage-gold-400 via-heritage-gold-300 to-heritage-gold-400" />
                    </div>

                    {/* Content Over Image */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="mb-3">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${style.badge}`}>
                                {style.icon}
                                {item.rankingType}
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3 drop-shadow-lg">{item.name}</h2>
                        <div className="flex items-center gap-3 text-sm flex-wrap">
                            {item.yearBuilt && (
                                <div className="flex items-center gap-1.5 bg-heritage-earth-900/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                                    <Calendar className="w-4 h-4 text-heritage-gold-400" />
                                    <span>Xây dựng: {item.yearBuilt}</span>
                                </div>
                            )}
                            {item.yearRanked && (
                                <div className="flex items-center gap-1.5 bg-heritage-earth-900/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                                    <Award className="w-4 h-4 text-heritage-gold-400" />
                                    <span>Xếp hạng: {item.yearRanked}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 bg-heritage-earth-900/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                                <MapPin className="w-4 h-4 text-heritage-gold-400" />
                                <span>{item.address.split(',').slice(-2).join(',').trim()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(90vh-320px)] scrollbar-heritage bg-white dark:bg-gray-800">
                    {/* Audio Control */}
                    {item.audioFile && (
                        <div className="mb-6 p-5 rounded-xl bg-gradient-to-r from-heritage-gold-50 to-heritage-cream-100 dark:from-gray-700 dark:to-gray-700 border-2 border-heritage-gold-200 dark:border-gray-600 relative overflow-hidden">
                            {/* Decorative accent */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-heritage-red-600 via-heritage-gold-500 to-heritage-red-600" />

                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-heritage-gold-500 flex items-center justify-center shadow-gold">
                                        <Volume2 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <span className="font-display font-semibold text-heritage-earth-900 dark:text-gray-100">Nghe giới thiệu</span>
                                        <p className="text-xs text-heritage-earth-500 dark:text-gray-400">Bản audio thuyết minh</p>
                                    </div>
                                </div>
                                {isPlaying && (
                                    <div className="flex gap-1 items-end h-6">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-1 bg-heritage-gold-500 dark:bg-heritage-gold-400 rounded-full animate-pulse"
                                                style={{
                                                    height: `${12 + (i % 3) * 6}px`,
                                                    animationDelay: `${i * 0.15}s`
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handlePlayAudio}
                                    disabled={isLoading}
                                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${isLoading
                                        ? 'bg-heritage-earth-200 cursor-not-allowed text-heritage-earth-500'
                                        : isPlaying
                                            ? 'bg-gradient-to-r from-heritage-gold-500 to-heritage-gold-600 text-white shadow-gold'
                                            : 'bg-gradient-to-r from-heritage-red-700 to-heritage-red-800 text-white shadow-heritage'
                                        }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            Đang tải...
                                        </>
                                    ) : isPlaying ? (
                                        <>
                                            <Pause className="w-5 h-5" />
                                            Tạm dừng
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-5 h-5" />
                                            Phát audio
                                        </>
                                    )}
                                </button>

                                {isPlaying && (
                                    <button
                                        onClick={handleStopAudio}
                                        className="px-6 py-3 rounded-xl font-semibold bg-heritage-earth-100 dark:bg-gray-600 text-heritage-earth-700 dark:text-gray-200 hover:bg-heritage-earth-200 dark:hover:bg-gray-500 transition-colors border border-heritage-earth-200 dark:border-gray-500"
                                    >
                                        Dừng
                                    </button>
                                )}
                            </div>

                            {audioError && (
                                <p className="text-sm text-heritage-red-600 mt-3 flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-heritage-red-100 flex items-center justify-center text-heritage-red-600">!</span>
                                    Không thể phát audio. Vui lòng thử lại.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Information Sections */}
                    <div className="space-y-6">
                        {/* Description with Text and Images */}
                        {informationData.sections.length > 0 && (
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-heritage-red-100 dark:bg-heritage-red-900/30 flex items-center justify-center border border-heritage-red-200 dark:border-heritage-red-700">
                                        <Info className="w-5 h-5 text-heritage-red-700 dark:text-heritage-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-display font-bold text-heritage-earth-900 dark:text-gray-100">
                                            Thông tin chi tiết
                                        </h3>
                                        <p className="text-xs text-heritage-earth-500 dark:text-gray-400">Lịch sử và giá trị văn hóa</p>
                                    </div>
                                </div>

                                {/* Ornamental divider */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-heritage-gold-400 dark:via-heritage-gold-600 to-transparent" />
                                    <Sparkles className="w-4 h-4 text-heritage-gold-500 dark:text-heritage-gold-400" />
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-heritage-gold-400 dark:via-heritage-gold-600 to-transparent" />
                                </div>

                                <div className="space-y-4">
                                    {informationData.sections.map((section, index) => (
                                        <div key={index}>
                                            {section.type === 'text' ? (
                                                <p className="text-heritage-earth-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                                    {section.content}
                                                </p>
                                            ) : (
                                                <div className="rounded-xl overflow-hidden shadow-elegant my-4 border border-heritage-earth-200 dark:border-gray-600">
                                                    <img
                                                        src={section.content}
                                                        alt={`${item.name} - Hình ${index + 1}`}
                                                        className="w-full h-auto object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {item.rankingType && (
                                <div className="p-4 rounded-xl bg-heritage-cream-50 dark:bg-gray-700 border border-heritage-earth-200 dark:border-gray-600">
                                    <div className="flex items-center gap-2 text-sm text-heritage-earth-500 dark:text-gray-400 mb-1">
                                        <Award className="w-4 h-4 text-heritage-gold-500" />
                                        <span>Loại xếp hạng</span>
                                    </div>
                                    <div className="font-semibold text-heritage-earth-900 dark:text-gray-100">{item.rankingType}</div>
                                </div>
                            )}

                            {item.address && (
                                <div className="p-4 rounded-xl bg-heritage-cream-50 dark:bg-gray-700 border border-heritage-earth-200 dark:border-gray-600">
                                    <div className="flex items-center gap-2 text-sm text-heritage-earth-500 dark:text-gray-400 mb-1">
                                        <MapPin className="w-4 h-4 text-heritage-red-600 dark:text-heritage-red-400" />
                                        <span>Địa chỉ đầy đủ</span>
                                    </div>
                                    <div className="font-semibold text-heritage-earth-900 dark:text-gray-100">{item.address}</div>
                                </div>
                            )}

                            {item.yearBuilt && (
                                <div className="p-4 rounded-xl bg-heritage-cream-50 dark:bg-gray-700 border border-heritage-earth-200 dark:border-gray-600">
                                    <div className="flex items-center gap-2 text-sm text-heritage-earth-500 dark:text-gray-400 mb-1">
                                        <Calendar className="w-4 h-4 text-heritage-gold-600 dark:text-heritage-gold-400" />
                                        <span>Năm xây dựng</span>
                                    </div>
                                    <div className="font-semibold text-heritage-earth-900 dark:text-gray-100">{item.yearBuilt}</div>
                                </div>
                            )}

                            {item.yearRanked && (
                                <div className="p-4 rounded-xl bg-heritage-cream-50 dark:bg-gray-700 border border-heritage-earth-200 dark:border-gray-600">
                                    <div className="flex items-center gap-2 text-sm text-heritage-earth-500 dark:text-gray-400 mb-1">
                                        <Award className="w-4 h-4 text-heritage-jade-600 dark:text-heritage-jade-400" />
                                        <span>Năm xếp hạng</span>
                                    </div>
                                    <div className="font-semibold text-heritage-earth-900 dark:text-gray-100">{item.yearRanked}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-heritage-earth-200 dark:border-gray-700 bg-heritage-cream-50 dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-sm text-heritage-earth-500 dark:text-gray-400">
                                <Landmark className="w-4 h-4 text-heritage-gold-500" />
                                <span>Mã số: <span className="font-semibold text-heritage-earth-700 dark:text-gray-200">#{item.id}</span></span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-lg bg-heritage-earth-800 hover:bg-heritage-earth-900 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-semibold transition-colors shadow-elegant"
                        >
                            Đóng
                        </button>
                    </div>
                </div>

                {/* Decorative bottom border */}
                <div className="h-1 bg-gradient-to-r from-heritage-red-700 via-heritage-gold-500 to-heritage-red-700" />
            </div>

            <audio ref={audioRef} className="hidden" />
        </div>
    );
}
