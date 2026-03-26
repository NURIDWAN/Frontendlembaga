interface RichTextSectionProps {
    data: {
        content_id?: string;
        content_en?: string;
        content_ar?: string;
    };
    locale: string;
}

export function RichTextSection({ data, locale }: RichTextSectionProps) {
    const content =
        (locale === 'ar' && data.content_ar) ||
        (locale === 'en' && data.content_en) ||
        data.content_id ||
        '';

    if (!content) return null;

    return (
        <section
            className="py-12 md:py-16"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
            <div className="mx-auto max-w-4xl px-4">
                <div
                    className="prose prose-lg prose-headings:text-gray-900 prose-a:text-brand prose-img:rounded-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </section>
    );
}
