import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { News } from '@/types';

interface NewsSectionProps {
    news: News[];
}

const NEWS_LABELS: Record<string, { no_image: string }> = {
    id: { no_image: 'Tanpa Gambar' },
    en: { no_image: 'No Image' },
    ar: { no_image: 'بدون صورة' },
};

function formatDate(dateString: string, locale: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(
        locale === 'id' ? 'id-ID' : locale === 'ar' ? 'ar-SA' : 'en-US',
        {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        },
    );
}

function stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function getTitle(item: News, locale: string): string {
    if (locale === 'en' && item.title_en) return item.title_en;
    if (locale === 'ar' && item.title_ar) return item.title_ar;
    return item.title_id;
}

function getBody(item: News, locale: string): string {
    let body: string;
    if (locale === 'en' && item.body_en) body = item.body_en;
    else if (locale === 'ar' && item.body_ar) body = item.body_ar;
    else body = item.body_id;
    return body ? stripHtml(body) : '';
}

function getCategoryName(category: News['category'], locale: string): string {
    if (!category) return '';
    return locale === 'en' && category.name_en
        ? category.name_en
        : category.name_id;
}

export default function LatestNews({ news }: NewsSectionProps) {
    const { lang, withLocale } = useLanguage();
    const [featured, ...rest] = news;
    const sideNews = rest.slice(0, 3);

    if (news.length === 0) return null;

    return (
        <section className="bg-gray-50 py-12 md:py-16 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-4">
                {/* Section Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                            {lang === 'ar'
                                ? 'أحدث الأخبار'
                                : lang === 'en'
                                  ? 'Latest News'
                                  : 'Berita Terbaru'}
                        </h2>
                        <div className="mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                    </div>
                    <Link
                        to={withLocale('/berita')}
                        className="flex items-center gap-1 text-sm font-medium text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-secondary)]"
                    >
                        {lang === 'ar'
                            ? 'عرض الكل'
                            : lang === 'en'
                              ? 'View All'
                              : 'Lihat Semua'}
                        <ArrowRight
                            className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`}
                        />
                    </Link>
                </div>

                {/* Grid: 1 featured + 3 side */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Featured Article */}
                    {featured && (
                        <Link
                            to={withLocale(`/berita/${featured.slug}`)}
                            className="group overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
                        >
                            <div className="relative aspect-video overflow-hidden">
                                {featured.image_path ? (
                                    <img
                                        src={featured.image_path}
                                        alt={getTitle(featured, lang)}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                                        <span className="text-gray-400">
                                            {(NEWS_LABELS[lang] || NEWS_LABELS.id).no_image}
                                        </span>
                                    </div>
                                )}
                                {featured.category && (
                                    <span className="absolute top-4 left-4 rounded bg-[var(--brand-primary)] px-3 py-1 text-xs font-semibold text-white">
                                        {getCategoryName(
                                            featured.category,
                                            lang,
                                        )}
                                    </span>
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-[var(--brand-primary)] md:text-xl dark:text-white">
                                    {getTitle(featured, lang)}
                                </h3>
                                <p className="mb-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
                                    {getBody(featured, lang)}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {formatDate(
                                            featured.published_at,
                                            lang,
                                        )}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Eye className="h-3.5 w-3.5" />
                                        {featured.views}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Side Articles */}
                    <div className="flex flex-col gap-4">
                        {sideNews.map((item) => (
                            <Link
                                key={item.id}
                                to={withLocale(`/berita/${item.slug}`)}
                                className="group flex gap-4 overflow-hidden rounded-xl bg-white p-3 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
                            >
                                <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg md:h-28 md:w-36">
                                    {item.image_path ? (
                                        <img
                                            src={item.image_path}
                                            alt={getTitle(item, lang)}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                                            <span className="text-xs text-gray-400">
                                                {(NEWS_LABELS[lang] || NEWS_LABELS.id).no_image}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col justify-center">
                                    {item.category && (
                                        <span className="mb-1 text-xs font-medium text-[var(--brand-primary)]">
                                            {getCategoryName(
                                                item.category,
                                                lang,
                                            )}
                                        </span>
                                    )}
                                    <h4 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] md:text-base dark:text-white">
                                        {getTitle(item, lang)}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(
                                                item.published_at,
                                                lang,
                                            )}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            {item.views}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
