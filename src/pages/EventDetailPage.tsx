import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import { fetchEventDetail } from '@/api/events';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';

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

export default function EventDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { lang, withLocale } = useLanguage();

    const {
        data: event,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['event-detail', id],
        queryFn: () => fetchEventDetail(Number(id)),
        enabled: !!id,
    });

    if (isLoading) return <Loading />;
    if (error || !event) return <ErrorState onRetry={() => refetch()} />;

    const title =
        lang === 'en'
            ? event.title_en
            : lang === 'ar'
              ? event.title_ar
              : event.title_id;
    const desc =
        lang === 'en'
            ? event.description_en
            : lang === 'ar'
              ? event.description_ar
              : event.description_id;

    const badge = getStatusBadge(event.status);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(
            lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'id-ID',
            { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
        );
    };

    return (
        <div className="py-8 md:py-12">
            <div className="mx-auto max-w-4xl px-4">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link
                        to={withLocale('/agenda-kegiatan')}
                        className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-[var(--brand-primary)] dark:text-gray-400 dark:hover:text-[var(--brand-primary)]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {lang === 'id' ? 'Semua Agenda' : 'All Events'}
                    </Link>
                </div>

                {/* Status Badge */}
                <span
                    className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${badge.className}`}
                >
                    {badge.label}
                </span>

                {/* Title */}
                <h1 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                    {title}
                </h1>

                {/* Meta Info */}
                <div className="mb-8 grid gap-3 rounded-xl border border-gray-100 bg-gray-50 p-5 sm:grid-cols-2 md:grid-cols-3 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-start gap-3">
                        <Calendar className="mt-0.5 h-5 w-5 text-[var(--brand-primary)]" />
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                                {lang === 'id' ? 'Tanggal' : 'Date'}
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {formatDate(event.date_start)}
                            </p>
                            {event.date_end &&
                                event.date_end !== event.date_start && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        — {formatDate(event.date_end)}
                                    </p>
                                )}
                        </div>
                    </div>

                    {event.time_start && (
                        <div className="flex items-start gap-3">
                            <Clock className="mt-0.5 h-5 w-5 text-[var(--brand-primary)]" />
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                                    {lang === 'id' ? 'Waktu' : 'Time'}
                                </p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {event.time_start.slice(0, 5)} WIB
                                </p>
                            </div>
                        </div>
                    )}

                    {event.location && (
                        <div className="flex items-start gap-3">
                            <MapPin className="mt-0.5 h-5 w-5 text-[var(--brand-primary)]" />
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                                    {lang === 'id' ? 'Lokasi' : 'Location'}
                                </p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {event.location}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Featured Image */}
                {event.image && (
                    <div className="mb-8 overflow-hidden rounded-xl">
                        <img
                            src={event.image}
                            alt={title}
                            loading="lazy"
                            className="w-full object-cover"
                        />
                    </div>
                )}

                {/* Description */}
                {desc && (
                    <div
                        className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 prose-a:text-[var(--brand-primary)] prose-img:rounded-lg"
                        dangerouslySetInnerHTML={{ __html: desc }}
                    />
                )}

                {/* Registration CTA */}
                {event.registration_url && event.status !== 'past' && (
                    <div className="mt-8 rounded-xl border border-[var(--brand-primary)]/20 bg-[var(--brand-primary)]/5 p-6 text-center dark:bg-[var(--brand-primary)]/10">
                        <p className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                            {lang === 'id'
                                ? 'Tertarik mengikuti kegiatan ini?'
                                : 'Interested in attending?'}
                        </p>
                        <a
                            href={event.registration_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-secondary)]"
                        >
                            <ExternalLink className="h-4 w-4" />
                            {lang === 'id' ? 'Daftar Sekarang' : 'Register Now'}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
