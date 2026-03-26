import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, ArrowLeft } from 'lucide-react';
import { fetchFaculties } from '@/api/faculties';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';
import { Pagination } from '@/components/ui/Pagination';

function stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

export default function FacultiesListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const { lang, withLocale } = useLanguage();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['faculties', page],
        queryFn: () => fetchFaculties(page),
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
                            ? 'Fakultas'
                            : lang === 'en'
                              ? 'Faculties'
                              : 'الكليات'}
                    </h1>
                    <div className="mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {data.meta?.total || data.data.length}{' '}
                        {lang === 'id'
                            ? 'fakultas tersedia'
                            : lang === 'en'
                              ? 'faculties available'
                              : 'كلية متاحة'}
                    </p>
                </div>

                {/* Faculties Grid */}
                {data.data.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {data.data.map((faculty) => {
                            const name =
                                lang === 'en'
                                    ? faculty.name_en
                                    : lang === 'ar'
                                      ? faculty.name_ar
                                      : faculty.name_id;
                            const desc =
                                lang === 'en'
                                    ? faculty.description_en
                                    : lang === 'ar'
                                      ? faculty.description_ar
                                      : faculty.description_id;
                            const excerpt = desc ? stripHtml(desc) : '';
                            const truncatedExcerpt =
                                excerpt.length > 120
                                    ? excerpt.substring(0, 120) + '...'
                                    : excerpt;

                            return (
                                <Link
                                    key={faculty.id}
                                    to={withLocale(`/fakultas/${faculty.slug}`)}
                                    className="group overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
                                >
                                    <div className="relative aspect-video overflow-hidden">
                                        {faculty.image ? (
                                            <img
                                                src={faculty.image}
                                                alt={name}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)]">
                                                <GraduationCap className="h-12 w-12 text-white/40" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="mb-2 line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] dark:text-white dark:group-hover:text-[var(--brand-primary)]">
                                            {name}
                                        </h3>
                                        {truncatedExcerpt && (
                                            <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                                                {truncatedExcerpt}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                                            {faculty.dean_name && (
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-3.5 w-3.5" />
                                                    {lang === 'id'
                                                        ? 'Dekan: '
                                                        : 'Dean: '}
                                                    {faculty.dean_name}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="h-3.5 w-3.5" />
                                                {faculty.study_programs_count ||
                                                    0}{' '}
                                                {lang === 'id'
                                                    ? 'Program Studi'
                                                    : 'Study Programs'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <GraduationCap className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-500 dark:text-gray-400">
                            {lang === 'id'
                                ? 'Belum ada data fakultas.'
                                : lang === 'en'
                                  ? 'No faculties available yet.'
                                  : 'لا توجد كليات حتى الآن.'}
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
