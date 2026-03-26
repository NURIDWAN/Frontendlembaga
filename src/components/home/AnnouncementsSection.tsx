import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Paperclip } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { Announcement } from '@/types';

interface AnnouncementsSectionProps {
    announcements: Announcement[];
}

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

function getTitle(item: Announcement, locale: string): string {
    if (locale === 'en' && item.title_en) return item.title_en;
    if (locale === 'ar' && item.title_ar) return item.title_ar;
    return item.title_id;
}

export default function AnnouncementsSection({
    announcements,
}: AnnouncementsSectionProps) {
    const { lang, withLocale } = useLanguage();

    if (announcements.length === 0) return null;

    const displayItems = announcements.slice(0, 4);

    return (
        <section className="py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4">
                {/* Section Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                            {lang === 'ar'
                                ? 'إعلانات'
                                : lang === 'en'
                                  ? 'Announcements'
                                  : 'Pengumuman'}
                        </h2>
                        <div className="mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                    </div>
                    <Link
                        to={withLocale('/pengumuman')}
                        className="flex items-center gap-1 text-sm font-medium text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-secondary)]"
                    >
                        {lang === 'ar'
                            ? 'عرض كل الإعلانات'
                            : lang === 'en'
                              ? 'View All Announcements'
                              : 'Lihat Semua Pengumuman'}
                        <ArrowRight
                            className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`}
                        />
                    </Link>
                </div>

                {/* Uniform Grid: 4 Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {displayItems.map((item) => (
                        <Link
                            key={item.id}
                            to={withLocale(`/pengumuman/${item.slug}`)}
                            className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
                        >
                            <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-emerald-50 dark:bg-emerald-900/20">
                                {item.image_url || item.image_path ? (
                                    <img
                                        src={
                                            item.image_url ||
                                            item.image_path ||
                                            undefined
                                        }
                                        alt={getTitle(item, lang)}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <Paperclip className="h-12 w-12 text-emerald-400/50 transition-transform duration-300 group-hover:scale-110" />
                                )}
                                <span className="absolute top-4 left-4 rounded bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                                    {lang === 'ar'
                                        ? 'إعلان'
                                        : lang === 'en'
                                          ? 'Announcement'
                                          : 'Pengumuman'}
                                </span>
                                {item.is_featured && (
                                    <span className="absolute top-4 left-[110px] rounded bg-yellow-400 px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm">
                                        {lang === 'ar'
                                            ? 'مميز'
                                            : lang === 'en'
                                              ? 'Featured'
                                              : 'Unggulan'}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                                <h3 className="mb-3 line-clamp-2 text-base font-bold text-gray-900 group-hover:text-[var(--brand-primary)] dark:text-white">
                                    {getTitle(item, lang)}
                                </h3>
                                <div className="mt-auto flex flex-col gap-3 border-t border-gray-100 pt-3 dark:border-gray-700">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <Calendar className="h-4 w-4 text-[var(--brand-primary)]" />
                                        {formatDate(item.published_at, lang)}
                                    </div>
                                    <span className="text-xs font-medium text-[var(--brand-primary)] transition-colors group-hover:translate-x-1 flex items-center gap-1">
                                        {lang === 'ar' ? 'اقرأ المزيد' : lang === 'en' ? 'Read more' : 'Selengkapnya'}
                                        {lang === 'ar' ? <ArrowRight className="h-3 w-3 rotate-180" /> : <ArrowRight className="h-3 w-3" />}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
