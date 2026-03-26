import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Clock, ArrowLeft } from 'lucide-react';
import { fetchEvents } from '@/api/events';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';
import { Pagination } from '@/components/ui/Pagination';

function formatDateBlock(dateString: string) {
    const date = new Date(dateString);
    return {
        day: date.getDate(),
        month: date.toLocaleDateString('id-ID', { month: 'short' }),
        year: date.getFullYear(),
    };
}

function getStatusBadge(status: string) {
    const styles: Record<
        string,
        {
            bg: string;
            text: string;
            darkBg: string;
            darkText: string;
            label: string;
        }
    > = {
        upcoming: {
            bg: 'bg-blue-100',
            text: 'text-blue-700',
            darkBg: 'dark:bg-blue-900/30',
            darkText: 'dark:text-blue-300',
            label: 'Akan Datang',
        },
        ongoing: {
            bg: 'bg-green-100',
            text: 'text-green-700',
            darkBg: 'dark:bg-[var(--brand-primary)]/30',
            darkText: 'dark:text-[var(--brand-primary)]',
            label: 'Berlangsung',
        },
        past: {
            bg: 'bg-gray-100',
            text: 'text-gray-600',
            darkBg: 'dark:bg-gray-700',
            darkText: 'dark:text-gray-300',
            label: 'Selesai',
        },
    };
    const style = styles[status] || styles.upcoming;
    return {
        className: `${style.bg} ${style.text} ${style.darkBg} ${style.darkText}`,
        label: style.label,
    };
}

export default function EventsListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const { lang, withLocale } = useLanguage();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['events', page],
        queryFn: () => fetchEvents(page),
    });

    if (isLoading) return <Loading />;
    if (error || !data) return <ErrorState onRetry={() => refetch()} />;

    return (
        <div className="py-8 md:py-12">
            <div className="mx-auto max-w-7xl px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to={withLocale('/')}
                        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-[var(--brand-primary)] dark:text-gray-400 dark:hover:text-[var(--brand-primary)]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Beranda
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                        {lang === 'id'
                            ? 'Agenda Kegiatan'
                            : lang === 'en'
                              ? 'Events'
                              : 'الأحداث'}
                    </h1>
                    <div className="mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {data.meta.total}{' '}
                        {lang === 'id'
                            ? 'agenda ditemukan'
                            : lang === 'en'
                              ? 'events found'
                              : 'حدث'}
                    </p>
                </div>

                {/* Events List */}
                {data.data.length > 0 ? (
                    <div className="space-y-4">
                        {data.data.map((event) => {
                            const title =
                                lang === 'en'
                                    ? event.title_en
                                    : lang === 'ar'
                                      ? event.title_ar
                                      : event.title_id;
                            const dateBlock = formatDateBlock(event.date_start);
                            const badge = getStatusBadge(event.status);

                            return (
                                <Link
                                    key={event.id}
                                    to={withLocale(`/agenda/${event.id}`)}
                                    className="group flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-[var(--brand-primary)]/20 hover:shadow-md md:gap-6 md:p-5 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-[var(--brand-primary)]/30"
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
                                        <h3 className="mb-1 line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] md:text-lg dark:text-white dark:group-hover:text-[var(--brand-primary)]">
                                            {title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 md:text-sm dark:text-gray-400">
                                            {event.time_start && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {event.time_start.slice(
                                                        0,
                                                        5,
                                                    )}{' '}
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

                                    {/* Thumbnail */}
                                    {(event.image_url || event.image) && (
                                        <div className="hidden h-24 w-36 flex-shrink-0 overflow-hidden rounded-lg md:block">
                                            <img
                                                src={
                                                    event.image_url ||
                                                    event.image
                                                }
                                                alt={title}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                            {lang === 'id'
                                ? 'Belum ada agenda kegiatan.'
                                : lang === 'en'
                                  ? 'No events available yet.'
                                  : 'لا توجد أحداث حتى الآن.'}
                        </p>
                    </div>
                )}

                <Pagination
                    meta={data.meta}
                    onPageChange={(p) => {
                        setSearchParams({ page: p.toString() });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                />
            </div>
        </div>
    );
}
