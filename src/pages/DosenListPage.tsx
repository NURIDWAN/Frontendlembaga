import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { User, Mail, Phone, Award, ArrowLeft } from 'lucide-react';
import { fetchDosenList } from '@/api/dosen';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';
import { Pagination } from '@/components/ui/Pagination';

export default function DosenListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const { lang, withLocale } = useLanguage();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['dosen-list', page],
        queryFn: () => fetchDosenList(page),
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
                        {lang === 'id'
                            ? 'Beranda'
                            : lang === 'en'
                              ? 'Home'
                              : 'الرئيسية'}
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                        {lang === 'id'
                            ? 'Dosen'
                            : lang === 'en'
                              ? 'Lecturers'
                              : 'المحاضرون'}
                    </h1>
                    <div className="mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {data.meta?.total || data.data.length}{' '}
                        {lang === 'id'
                            ? 'dosen tersedia'
                            : lang === 'en'
                              ? 'lecturers available'
                              : 'محاضر متاح'}
                    </p>
                </div>

                {/* Dosen Grid */}
                {data.data.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {data.data.map((dosen) => {
                            const expertise =
                                lang === 'en'
                                    ? dosen.expertise_en
                                    : lang === 'ar'
                                      ? dosen.expertise_ar
                                      : dosen.expertise_id;
                            const studyProgramName = dosen.study_program
                                ? lang === 'en'
                                    ? dosen.study_program.name_en ||
                                      dosen.study_program.name_id
                                    : dosen.study_program.name_id
                                : null;

                            return (
                                <Link
                                    key={dosen.id}
                                    to={withLocale(`/dosen/${dosen.id}`)}
                                    className="group overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
                                >
                                    <div className="relative aspect-square overflow-hidden">
                                        {dosen.photo ? (
                                            <img
                                                src={dosen.photo}
                                                alt={dosen.full_name}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700">
                                                <User className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="mb-1 text-sm font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] dark:text-white dark:group-hover:text-[var(--brand-primary)]">
                                            {dosen.full_name}
                                        </h3>
                                        {dosen.nidn && (
                                            <p className="mb-1 text-xs text-gray-400">
                                                NIDN: {dosen.nidn}
                                            </p>
                                        )}
                                        {studyProgramName && (
                                            <p className="mb-2 text-xs text-[var(--brand-primary)] dark:text-[var(--brand-primary)]">
                                                {studyProgramName}
                                            </p>
                                        )}
                                        {expertise && (
                                            <p className="mb-2 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                                                {expertise}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2">
                                            {dosen.email && (
                                                <span
                                                    className="rounded-full bg-gray-100 p-1.5 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                                    title={dosen.email}
                                                >
                                                    <Mail className="h-3.5 w-3.5" />
                                                </span>
                                            )}
                                            {dosen.phone && (
                                                <span
                                                    className="rounded-full bg-gray-100 p-1.5 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                                    title={dosen.phone}
                                                >
                                                    <Phone className="h-3.5 w-3.5" />
                                                </span>
                                            )}
                                            {dosen.scholar_url && (
                                                <span
                                                    className="rounded-full bg-gray-100 p-1.5 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                                    title="Google Scholar"
                                                >
                                                    <Award className="h-3.5 w-3.5" />
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
                        <User className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-500 dark:text-gray-400">
                            {lang === 'id'
                                ? 'Belum ada data dosen.'
                                : lang === 'en'
                                  ? 'No lecturers available yet.'
                                  : 'لا يوجد محاضرون حتى الآن.'}
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
