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

    const embedUrl = getEmbedUrl(data.video_url || '');

    if (!embedUrl) return null;

    return (
        <section
            className="py-12 md:py-16"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
            <div className="mx-auto max-w-4xl px-4">
                {title && (
                    <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 md:text-3xl">
                        {title}
                    </h2>
                )}
                {description && (
                    <p className="mx-auto mb-8 max-w-2xl text-center text-gray-600">
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
