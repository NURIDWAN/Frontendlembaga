import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { Event } from '@/types';

interface EventsSectionProps {
    events: Event[];
}

function getTitle(item: Event, locale: string): string {
    if (locale === 'en' && item.title_en) return item.title_en;
    if (locale === 'ar' && item.title_ar) return item.title_ar;
    return item.title_id;
}

function formatDateBlock(dateString: string, locale: string) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString(
        locale === 'id' ? 'id-ID' : locale === 'ar' ? 'ar-SA' : 'en-US',
        {
            month: 'short',
        },
    );
    const year = date.getFullYear();
    return { day, month, year };
}

function getStatusBadge(status: string, locale: string) {
    const styles: Record<
        string,
        {
            bg: string;
            text: string;
            label_id: string;
            label_en: string;
            label_ar: string;
        }
    > = {
        upcoming: {
            bg: 'bg-blue-100 dark:bg-blue-900/30',
            text: 'text-blue-700 dark:text-blue-300',
            label_id: 'Akan Datang',
            label_en: 'Upcoming',
            label_ar: 'قادم',
        },
        ongoing: {
            bg: 'bg-[var(--brand-primary)]/10 dark:bg-[var(--brand-primary)]/30',
            text: 'text-[var(--brand-primary)] dark:text-[var(--brand-primary)]',
            label_id: 'Berlangsung',
            label_en: 'Ongoing',
            label_ar: 'جاري',
        },
        past: {
            bg: 'bg-gray-100 dark:bg-gray-700',
            text: 'text-gray-600 dark:text-gray-300',
            label_id: 'Selesai',
            label_en: 'Past',
            label_ar: 'منتهي',
        },
    };
    const style = styles[status] || styles.upcoming;
    return {
        className: `${style.bg} ${style.text}`,
        label:
            locale === 'ar'
                ? style.label_ar
                : locale === 'en'
                  ? style.label_en
                  : style.label_id,
    };
}

export default function UpcomingEvents({ events }: EventsSectionProps) {
    const { lang, withLocale } = useLanguage();

    if (events.length === 0) return null;

    return (
        <section className="py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4">
                {/* Section Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                            {lang === 'ar'
                                ? 'الأحداث'
                                : lang === 'en'
                                  ? 'Events'
                                  : 'Agenda Kegiatan'}
                        </h2>
                        <div className="mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                    </div>
                    <Link
                        to={withLocale('/agenda-kegiatan')}
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

                {/* Events List */}
                <div className="space-y-4">
                    {events.map((event) => {
                        const dateBlock = formatDateBlock(
                            event.date_start,
                            lang,
                        );
                        const badge = getStatusBadge(event.status, lang);

                        return (
                            <Link
                                key={event.id}
                                to={withLocale(`/agenda/${event.id}`)}
                                className="group flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-[var(--brand-primary)]/20 hover:shadow-md md:gap-6 md:p-5 dark:border-gray-700 dark:bg-gray-800"
                            >
                                {/* Date Block */}
                                <div className="flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-[var(--brand-primary)] text-white md:h-24 md:w-24">
                                    <span className="text-2xl font-bold md:text-3xl">
                                        {dateBlock.day}
                                    </span>
                                    <span className="text-xs tracking-wide uppercase md:text-sm">
                                        {dateBlock.month}
                                    </span>
                                    <span className="text-xs opacity-70">
                                        {dateBlock.year}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex flex-1 flex-col justify-center">
                                    <div className="mb-1 flex flex-wrap items-center gap-2">
                                        <span
                                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
                                        >
                                            {badge.label}
                                        </span>
                                    </div>
                                    <h3 className="mb-1 line-clamp-1 text-base font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] md:text-lg dark:text-white">
                                        {getTitle(event, lang)}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 md:text-sm dark:text-gray-400">
                                        {event.time_start && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5" />
                                                {event.time_start.slice(0, 5)}{' '}
                                                WIB
                                            </span>
                                        )}
                                        {event.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {event.location}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Thumbnail (optional, only on md+) */}
                                {(event.image_url || event.image) && (
                                    <div className="hidden h-24 w-36 flex-shrink-0 overflow-hidden rounded-lg md:block">
                                        <img
                                            src={event.image_url || event.image}
                                            alt={getTitle(event, lang)}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
