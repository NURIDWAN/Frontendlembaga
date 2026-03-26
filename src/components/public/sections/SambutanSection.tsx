import { Quote } from 'lucide-react';
import { useState } from 'react';

interface SambutanSectionProps {
    data: {
        photo?: string;
        title_id?: string;
        title_en?: string;
        title_ar?: string;
        name?: string;
        position_id?: string;
        position_en?: string;
        position_ar?: string;
        message_id?: string;
        message_en?: string;
        message_ar?: string;
    };
    locale: string;
}

export function SambutanSection({ data, locale }: SambutanSectionProps) {
    const getField = (field: 'title' | 'position' | 'message') => {
        if (locale === 'ar')
            return data[`${field}_ar`] || data[`${field}_id`] || '';
        if (locale === 'en')
            return data[`${field}_en`] || data[`${field}_id`] || '';
        return data[`${field}_id`] || '';
    };

    const title = getField('title');
    const position = getField('position');
    const message = getField('message');
    const name = data.name || '';

    // Resolve photo URL (if external or relative)
    const getPhotoUrl = (path: string | undefined) => {
        if (!path || path === 'null' || path === 'undefined') return undefined;
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        return `/storage/${path}`;
    };

    const photoUrl = getPhotoUrl(data.photo);
    const [imageError, setImageError] = useState(false);
    const isRtl = locale === 'ar';

    if (!title && !message) return null;

    const showPhoto = photoUrl && !imageError;

    return (
        <section
            className="overflow-hidden bg-white py-16 md:py-24 dark:bg-gray-900"
            dir={isRtl ? 'rtl' : 'ltr'}
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-16">
                    {/* Photo Column */}
                    {showPhoto && (
                        <div
                            className={`mb-12 lg:col-span-12 lg:mb-0 xl:col-span-4 ${isRtl ? 'xl:order-last' : ''}`}
                        >
                            <div className="relative mx-auto max-w-sm">
                                {/* Decorative elements */}
                                <div className="absolute -top-4 -left-4 h-full w-full rounded-2xl bg-[var(--brand-primary)]/10 dark:bg-[var(--brand-primary)]/20"></div>
                                <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-[var(--brand-primary)]/5 dark:bg-[var(--brand-primary)]/10"></div>

                                <img
                                    src={photoUrl}
                                    alt={name}
                                    onError={() => setImageError(true)}
                                    className="relative z-10 aspect-[3/4] w-full rounded-2xl bg-gray-100 object-cover shadow-xl"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    )}

                    {/* Content Column */}
                    <div
                        className={`lg:col-span-${showPhoto ? '12 xl:col-span-8' : '12'}`}
                    >
                        {title && (
                            <h2 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                                {title}
                            </h2>
                        )}

                        <div className="relative mt-10">
                            <Quote
                                className={`absolute -top-8 h-16 w-16 text-[var(--brand-primary)]/15 dark:text-[var(--brand-primary)]/30 ${isRtl ? '-right-2' : '-left-2'}`}
                            />

                            <div
                                className={`relative z-10 ${isRtl ? 'pr-6 sm:pr-10' : 'pl-6 sm:pl-10'}`}
                            >
                                <div
                                    className="prose prose-lg text-gray-600 dark:text-gray-300 dark:prose-invert"
                                    dangerouslySetInnerHTML={{
                                        __html: message.replace(/\n/g, '<br/>'),
                                    }}
                                />

                                <div className="mt-8 border-t border-gray-100 pt-6 dark:border-gray-800">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-1 rounded-full bg-[var(--brand-primary)]"></div>
                                        <div>
                                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                                                {name}
                                            </div>
                                            {position && (
                                                <div className="text-sm font-medium text-[var(--brand-primary)] dark:text-[var(--brand-primary)]">
                                                    {position}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
