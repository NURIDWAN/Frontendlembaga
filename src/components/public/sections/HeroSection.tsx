interface HeroSectionProps {
    data: {
        title_id?: string;
        title_en?: string;
        title_ar?: string;
        subtitle_id?: string;
        subtitle_en?: string;
        subtitle_ar?: string;
        cta_text_id?: string;
        cta_text_en?: string;
        cta_text_ar?: string;
        cta_url?: string;
        background_image?: string;
        overlay_opacity?: number;
    };
    locale: string;
}

function getText(
    data: Record<string, string | undefined>,
    field: string,
    locale: string,
): string {
    const localeField = `${field}_${locale}`;
    return data[localeField] || data[`${field}_id`] || '';
}

export function HeroSection({ data, locale }: HeroSectionProps) {
    const title = getText(
        data as Record<string, string | undefined>,
        'title',
        locale,
    );
    const subtitle = getText(
        data as Record<string, string | undefined>,
        'subtitle',
        locale,
    );
    const ctaText = getText(
        data as Record<string, string | undefined>,
        'cta_text',
        locale,
    );
    const ctaUrl = data.cta_url || '';
    const bgImage = data.background_image || '';
    const overlayOpacity = data.overlay_opacity ?? 50;

    return (
        <section
            className="relative flex min-h-[400px] items-center justify-center overflow-hidden md:min-h-[500px]"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
            {/* Background */}
            {bgImage ? (
                <div className="absolute inset-0">
                    <img
                        src={
                            bgImage.startsWith('http')
                                ? bgImage
                                : `/storage/${bgImage}`
                        }
                        alt=""
                        className="h-full w-full object-cover"
                    />
                    <div
                        className="absolute inset-0 bg-black"
                        style={{ opacity: overlayOpacity / 100 }}
                    />
                </div>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-hover to-brand/95" />
            )}

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 text-center text-white">
                {title && (
                    <h1 className="mb-4 text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">
                        {title}
                    </h1>
                )}
                {subtitle && (
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90 md:text-xl">
                        {subtitle}
                    </p>
                )}
                {ctaText && ctaUrl && (
                    <a
                        href={ctaUrl}
                        className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-brand shadow-lg transition-transform hover:scale-105"
                    >
                        {ctaText}
                    </a>
                )}
            </div>
        </section>
    );
}
