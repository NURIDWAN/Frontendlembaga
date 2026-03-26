import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, Award, Filter, ArrowLeft } from 'lucide-react';
import { fetchAchievements } from '@/api/achievements';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';
import { Pagination } from '@/components/ui/Pagination';

function stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

export default function AchievementsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const year = searchParams.get('year') || '';
    const category = searchParams.get('category') || '';
    const { lang, withLocale } = useLanguage();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['achievements', page, year, category],
        queryFn: () =>
            fetchAchievements({
                page,
                year: year || undefined,
                category: category || undefined,
            }),
        staleTime: 1000 * 60 * 2,
    });

    if (isLoading) return <Loading />;
    if (error || !data) return <ErrorState onRetry={() => refetch()} />;

    const updateFilters = (params: Record<string, string>) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(params).forEach(([k, v]) => {
            if (v) {
                newParams.set(k, v);
            } else {
                newParams.delete(k);
            }
        });
        // Reset page when filter changes
        if (!params.page) {
            newParams.delete('page');
        }
        setSearchParams(newParams);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                            ? 'Prestasi Mahasiswa'
                            : lang === 'en'
                              ? 'Student Achievements'
                              : 'إنجازات الطلاب'}
                    </h1>
                    <div className="mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {data.meta.total}{' '}
                        {lang === 'id'
                            ? 'prestasi tercatat'
                            : lang === 'en'
                              ? 'achievements recorded'
                              : 'إنجاز مسجل'}
                    </p>
                </div>

                {/* Filters */}
                {data.filters && (
                    <div className="mb-6 flex flex-wrap items-center gap-3">
                        <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />

                        {data.filters.years &&
                            data.filters.years.length > 0 && (
                                <select
                                    value={year}
                                    onChange={(e) =>
                                        updateFilters({ year: e.target.value })
                                    }
                                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-[var(--brand-primary)] focus:ring-[var(--brand-primary)] focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                >
                                    <option value="">
                                        {lang === 'id'
                                            ? 'Semua Tahun'
                                            : 'All Years'}
                                    </option>
                                    {data.filters.years.map((y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                            )}

                        {data.filters.categories &&
                            data.filters.categories.length > 0 && (
                                <select
                                    value={category}
                                    onChange={(e) =>
                                        updateFilters({
                                            category: e.target.value,
                                        })
                                    }
                                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-[var(--brand-primary)] focus:ring-[var(--brand-primary)] focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                >
                                    <option value="">
                                        {lang === 'id'
                                            ? 'Semua Kategori'
                                            : 'All Categories'}
                                    </option>
                                    {data.filters.categories.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            )}

                        {(year || category) && (
                            <button
                                onClick={() =>
                                    updateFilters({ year: '', category: '' })
                                }
                                className="text-sm font-medium text-[var(--brand-primary)] hover:text-[var(--brand-secondary)] dark:text-[var(--brand-primary)] dark:hover:text-[var(--brand-secondary)]"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>
                )}

                {/* Achievements Grid */}
                {data.data.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {data.data.map((achievement) => {
                            const title =
                                lang === 'en'
                                    ? achievement.title_en
                                    : lang === 'ar'
                                      ? achievement.title_ar
                                      : achievement.title_id;
                            const desc =
                                lang === 'en'
                                    ? achievement.description_en
                                    : lang === 'ar'
                                      ? achievement.description_ar
                                      : achievement.description_id;
                            const excerpt = desc ? stripHtml(desc) : '';
                            const truncatedExcerpt =
                                excerpt.length > 120
                                    ? excerpt.substring(0, 120) + '...'
                                    : excerpt;

                            return (
                                <Link
                                    key={achievement.id}
                                    to={withLocale(
                                        `/prestasi/${achievement.id}`,
                                    )}
                                    className="group overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
                                >
                                    <div className="relative aspect-video overflow-hidden">
                                        {achievement.image ? (
                                            <img
                                                src={
                                                    achievement.image_url ||
                                                    achievement.image
                                                }
                                                alt={title}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)]">
                                                <Trophy className="h-12 w-12 text-white/40" />
                                            </div>
                                        )}
                                        {achievement.ranking && (
                                            <span className="absolute top-2 right-2 rounded-full bg-yellow-500 px-2.5 py-0.5 text-xs font-bold text-white">
                                                {achievement.ranking}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="mb-1 line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] dark:text-white dark:group-hover:text-[var(--brand-primary)]">
                                            {title}
                                        </h3>
                                        <p className="mb-2 text-sm font-medium text-[var(--brand-primary)] dark:text-[var(--brand-primary)]">
                                            {achievement.student_name}
                                        </p>
                                        {truncatedExcerpt && (
                                            <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                                                {truncatedExcerpt}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {achievement.year}
                                            </span>
                                            {achievement.category && (
                                                <span className="flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 font-medium dark:bg-gray-700">
                                                    <Award className="h-3 w-3" />
                                                    {achievement.category}
                                                </span>
                                            )}
                                            {achievement.event_name && (
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    {achievement.event_name}
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
                        <Trophy className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-500 dark:text-gray-400">
                            {lang === 'id'
                                ? 'Belum ada data prestasi mahasiswa.'
                                : lang === 'en'
                                  ? 'No student achievements available yet.'
                                  : 'لا توجد إنجازات طلابية حتى الآن.'}
                        </p>
                    </div>
                )}

                <Pagination
                    meta={data.meta}
                    onPageChange={(p) => updateFilters({ page: p.toString() })}
                />
            </div>
        </div>
    );
}
