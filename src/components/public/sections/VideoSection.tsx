import { Video } from 'lucide-react';

interface VideoSectionProps {
    data: {
        title_id?: string;
        title_en?: string;
        title_ar?: string;
        description_id?: string;
        description_en?: string;
        description_ar?: string;
        video_url?: string;
    };
    locale: string;
}

const VIDEO_LABELS: Record<string, { invalid_url: string; no_video: string }> = {
    id: {
        invalid_url: 'URL video tidak valid. Harap gunakan link YouTube atau Vimeo.',
        no_video: 'Video belum tersedia.',
    },
    en: {
        invalid_url: 'Invalid video URL. Please use a YouTube or Vimeo link.',
        no_video: 'No video available.',
    },
    ar: {
        invalid_url: 'رابط الفيديو غير صالح. يرجى استخدام رابط YouTube أو Vimeo.',
        no_video: 'لا يوجد فيديو متاح.',
    },
};

function getEmbedUrl(url: string): string | null {
    if (!url) return null;

    // YouTube
    const ytMatch = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/,
    );
    if (ytMatch) {
        return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
    if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return null;
}

export function VideoSection({ data, locale }: VideoSectionProps) {
    const t = VIDEO_LABELS[locale] || VIDEO_LABELS.id;

    const title =
        (locale === 'ar' && data.title_ar) ||
        (locale === 'en' && data.title_en) ||
        data.title_id ||
        '';

    const description =
        (locale === 'ar' && data.description_ar) ||
        (locale === 'en' && data.description_en) ||
        data.description_id ||
        '';

    const videoUrl = data.video_url || '';
    const embedUrl = getEmbedUrl(videoUrl);

    // Show empty state if no video URL provided
    if (!videoUrl) {
        return (
            <section
                className="py-12 md:py-16"
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
            >
                <div className="mx-auto max-w-4xl px-4 text-center">
                    {title && (
                        <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                            {title}
                        </h2>
                    )}
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 dark:border-gray-700 dark:bg-gray-800/50">
                        <Video className="mb-4 h-12 w-12 text-gray-400 dark:text-gray-500" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t.no_video}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    // Show warning if URL provided but cannot be embedded
    if (!embedUrl) {
        return (
            <section
                className="py-12 md:py-16"
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
            >
                <div className="mx-auto max-w-4xl px-4 text-center">
                    {title && (
                        <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                            {title}
                        </h2>
                    )}
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-amber-300 bg-amber-50 py-16 dark:border-amber-700 dark:bg-amber-900/20">
                        <Video className="mb-4 h-12 w-12 text-amber-500 dark:text-amber-400" />
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                            {t.invalid_url}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            className="py-12 md:py-16"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
            <div className="mx-auto max-w-4xl px-4">
                {title && (
                    <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                        {title}
                    </h2>
                )}
                {description && (
                    <p className="mx-auto mb-8 max-w-2xl text-center text-gray-600 dark:text-gray-400">
                        {description}
                    </p>
                )}
                <div className="overflow-hidden rounded-xl shadow-lg">
                    <div className="relative aspect-video w-full">
                        <iframe
                            src={embedUrl}
                            title={title || 'Video'}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 h-full w-full"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
