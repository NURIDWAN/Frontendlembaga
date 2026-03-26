interface CtaSectionProps {
    data: {
        title_id?: string;
        title_en?: string;
        title_ar?: string;
        description_id?: string;
        description_en?: string;
        description_ar?: string;
        button_text_id?: string;
        button_text_en?: string;
        button_text_ar?: string;
        url?: string;
        background_color?: string;
    };
    locale: string;
}

function getLocalized(
    data: Record<string, string | undefined>,
    field: string,
    locale: string,
): string {
    return data[`${field}_${locale}`] || data[`${field}_id`] || '';
}

export function CtaSection({ data, locale }: CtaSectionProps) {
    const d = data as Record<string, string | undefined>;
    const title = getLocalized(d, 'title', locale);
    const description = getLocalized(d, 'description', locale);
    const buttonText = getLocalized(d, 'button_text', locale);
    const url = data.url || '';
    const bgColor = data.background_color || '#065f46';

    if (!title && !description) return null;

    return (
        <section
            className="py-16 md:py-20"
            style={{ backgroundColor: bgColor }}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
            <div className="mx-auto max-w-4xl px-4 text-center">
                {title && (
                    <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl lg:text-4xl">
                        {title}
                    </h2>
                )}
                {description && (
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
                        {description}
                    </p>
                )}
                {buttonText && url && (
                    <a
                        href={url}
                        className="inline-block rounded-lg bg-white px-8 py-3 font-semibold shadow-lg transition-transform hover:scale-105"
                        style={{ color: bgColor }}
                    >
                        {buttonText}
                    </a>
                )}
            </div>
        </section>
    );
}
