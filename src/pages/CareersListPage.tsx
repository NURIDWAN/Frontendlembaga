import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, Briefcase, Clock, ArrowLeft } from 'lucide-react';
import { fetchCareers } from '@/api/careers';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';
import { Pagination } from '@/components/ui/Pagination';

function stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

export default function CareersListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const { lang, withLocale } = useLanguage();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['careers', page],
        queryFn: () => fetchCareers(page),
        staleTime: 1000 * 60 * 2,
    });

    if (isLoading) return <Loading />;
    if (error || !data) return <ErrorState onRetry={() => refetch()} />;

    const handlePageChange = (p: number) => {
        setSearchParams({ page: p.toString() });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const isDeadlinePassed = (deadline: string) => {
        return new Date(deadline) < new Date();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(
            lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'id-ID',
            { day: 'numeric', month: 'long', year: 'numeric' },
        );
    };

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
                            ? 'Informasi Karir'
                            : lang === 'en'
                              ? 'Career Information'
                              : 'معلومات الوظائف'}
                    </h1>
                    <div className="mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {data.meta.total}{' '}
                        {lang === 'id'
                            ? 'lowongan tersedia'
                            : lang === 'en'
                              ? 'positions available'
                              : 'وظيفة متاحة'}
                    </p>
                </div>

                {/* Careers Grid */}
                {data.data.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {data.data.map((career) => {
                            const title =
                                lang === 'en'
                                    ? career.title_en
                                    : lang === 'ar'
                                      ? career.title_ar
                                      : career.title_id;
                            const desc =
                                lang === 'en'
                                    ? career.description_en
                                    : lang === 'ar'
                                      ? career.description_ar
                                      : career.description_id;
                            const deadlinePassed = career.deadline
                                ? isDeadlinePassed(career.deadline)
                                : false;
                            const excerpt = desc ? stripHtml(desc) : '';
                            const truncatedExcerpt =
                                excerpt.length > 150
                                    ? excerpt.substring(0, 150) + '...'
                                    : excerpt;

                            return (
                                <Link
                                    key={career.id}
                                    to={withLocale(`/karir/${career.id}`)}
                                    className="group overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
                                >
                                    <div className="relative aspect-video overflow-hidden">
                                        {career.image ? (
                                            <img
                                                src={career.image}
                                                alt={title}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)]">
                                                <Briefcase className="h-12 w-12 text-white/40" />
                                            </div>
                                        )}
                                        <span className="absolute top-2 right-2 rounded-full bg-green-600 px-3 py-0.5 text-xs font-semibold text-white">
                                            {career.status === 'open' &&
                                            !deadlinePassed
                                                ? lang === 'id'
                                                    ? 'Dibuka'
                                                    : 'Open'
                                                : lang === 'id'
                                                  ? 'Ditutup'
                                                  : 'Closed'}
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="mb-2 line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] dark:text-white dark:group-hover:text-[var(--brand-primary)]">
                                            {title}
                                        </h3>
                                        {truncatedExcerpt && (
                                            <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                                                {truncatedExcerpt}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                                            {career.published_at && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {formatDate(
                                                        career.published_at,
                                                    )}
                                                </span>
                                            )}
                                            {career.deadline && (
                                                <span className="flex items-center gap-1 text-red-500 dark:text-red-400">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {lang === 'id'
                                                        ? 'Batas: '
                                                        : 'Deadline: '}
                                                    {formatDate(
                                                        career.deadline,
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <Briefcase className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-500 dark:text-gray-400">
                            {lang === 'id'
                                ? 'Belum ada lowongan karir saat ini.'
                                : lang === 'en'
                                  ? 'No career openings available at the moment.'
                                  : 'لا توجد وظائف متاحة حاليًا.'}
                        </p>
                    </div>
                )}

                <Pagination meta={data.meta} onPageChange={handlePageChange} />
            </div>
        </div>
    );
}
