interface TimelineItem {
    year: string;
    title_id: string;
    title_en: string;
    title_ar: string;
    description_id: string;
    description_en: string;
    description_ar: string;
}

interface TimelineSectionProps {
    data: {
        title_id?: string;
        title_en?: string;
        title_ar?: string;
        items?: TimelineItem[];
    };
    locale: string;
}

export function TimelineSection({ data, locale }: TimelineSectionProps) {
    const isRtl = locale === 'ar';

    const getField = (obj: any, field: string) => {
        if (locale === 'ar')
            return obj[`${field}_ar`] || obj[`${field}_id`] || '';
        if (locale === 'en')
            return obj[`${field}_en`] || obj[`${field}_id`] || '';
        return obj[`${field}_id`] || '';
    };

    const title = getField(data, 'title');
    const items = data.items || [];

    if (!items.length) return null;

    return (
        <section
            className="overflow-hidden bg-white py-16 md:py-24 dark:bg-gray-900"
            dir={isRtl ? 'rtl' : 'ltr'}
        >
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                {title && (
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                            {title}
                        </h2>
                    </div>
                )}

                <div className="relative">
                    {/* Vertical line desktop */}
                    <div className="absolute top-0 bottom-0 left-1/2 hidden w-0.5 -translate-x-1/2 bg-[var(--brand-primary)]/20 md:block dark:bg-[var(--brand-primary)]/30" />

                    {/* Vertical line mobile */}
                    <div
                        className={`absolute top-0 bottom-0 w-0.5 bg-[var(--brand-primary)]/20 md:hidden dark:bg-[var(--brand-primary)]/30 ${isRtl ? 'right-4 translate-x-1/2' : 'left-4 -translate-x-1/2'}`}
                    />

                    <div className="space-y-8 text-gray-900 md:space-y-0 dark:text-white">
                        {items.map((item, index) => {
                            const isEven = index % 2 === 0;
                            const itemTitle = getField(item, 'title');
                            const itemDesc = getField(item, 'description');

                            return (
                                <div key={index} className="group">
                                    {/* Desktop view */}
                                    <div className="relative hidden py-8 md:grid md:grid-cols-2">
                                        <div className="absolute top-1/2 left-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-[var(--brand-primary)] transition-transform duration-300 group-hover:scale-150 dark:border-gray-900" />

                                        {isEven ? (
                                            <>
                                                <div
                                                    className={`px-12 ${isRtl ? 'text-left' : 'text-right'}`}
                                                >
                                                    <div className="mb-2 text-2xl font-bold text-[var(--brand-primary)] dark:text-[var(--brand-primary)]">
                                                        {item.year}
                                                    </div>
                                                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                                                        {itemTitle}
                                                    </h3>
                                                    <div
                                                        className="prose prose-sm max-w-none leading-relaxed text-gray-600 dark:text-gray-400 dark:prose-invert"
                                                        dangerouslySetInnerHTML={{
                                                            __html: itemDesc,
                                                        }}
                                                    />
                                                </div>
                                                <div></div>
                                            </>
                                        ) : (
                                            <>
                                                <div></div>
                                                <div
                                                    className={`px-12 ${isRtl ? 'text-right' : 'text-left'}`}
                                                >
                                                    <div className="mb-2 text-2xl font-bold text-[var(--brand-primary)] dark:text-[var(--brand-primary)]">
                                                        {item.year}
                                                    </div>
                                                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                                                        {itemTitle}
                                                    </h3>
                                                    <div
                                                        className="prose prose-sm max-w-none leading-relaxed text-gray-600 dark:text-gray-400 dark:prose-invert"
                                                        dangerouslySetInnerHTML={{
                                                            __html: itemDesc,
                                                        }}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Mobile view */}
                                    <div
                                        className={`relative py-4 md:hidden ${isRtl ? 'pr-12' : 'pl-12'}`}
                                    >
                                        <div
                                            className={`absolute top-6 ${isRtl ? 'right-4 translate-x-1/2' : 'left-4 -translate-x-1/2'} z-10 h-4 w-4 rounded-full border-4 border-white bg-[var(--brand-primary)] transition-transform duration-300 group-hover:scale-150 dark:border-gray-900`}
                                        />
                                        <div>
                                            <div className="mb-1 text-xl font-bold text-[var(--brand-primary)] dark:text-[var(--brand-primary)]">
                                                {item.year}
                                            </div>
                                            <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                                                {itemTitle}
                                            </h3>
                                            <div
                                                className="prose prose-sm max-w-none leading-relaxed text-gray-600 dark:text-gray-400 dark:prose-invert"
                                                dangerouslySetInnerHTML={{
                                                    __html: itemDesc,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
