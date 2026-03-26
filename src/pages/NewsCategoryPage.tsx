import { useQuery } from '@tanstack/react-query';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Calendar, Eye, ArrowLeft } from 'lucide-react';
import { fetchNewsByCategory } from '@/api/news';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';
import { Pagination } from '@/components/ui/Pagination';

export default function NewsCategoryPage() {
    const { slug } = useParams<{ slug: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const { lang, withLocale } = useLanguage();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['news-category', slug, page],
        queryFn: () => fetchNewsByCategory(slug!, page),
        enabled: !!slug,
    });

    if (isLoading) return <Loading />;
    if (error || !data) return <ErrorState onRetry={() => refetch()} />;

    const categoryName =
        lang === 'en' ? data.category.name_en : data.category.name_id;

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
                        {lang === 'en' ? 'Home' : 'Beranda'}
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                        {categoryName}
                    </h1>
                    <div className="mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {data.meta.total}{' '}
                        {lang === 'en' ? 'articles found' : 'artikel ditemukan'}
                    </p>
                </div>

                {/* News Grid */}
                {data.data.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {data.data.map((item) => {
                            const title =
                                lang === 'en'
                                    ? item.title_en
                                    : lang === 'ar'
                                      ? item.title_ar
                                      : item.title_id;
                            const excerpt =
                                lang === 'en'
                                    ? item.excerpt_en
                                    : lang === 'ar'
                                      ? item.excerpt_ar
                                      : item.excerpt_id;
                            return (
                                <Link
                                    key={item.id}
                                    to={withLocale(`/berita/${item.slug}`)}
                                    className="group overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
                                >
                                    <div className="relative aspect-video overflow-hidden">
                                        {item.image_path ? (
                                            <img
                                                src={item.image_path}
                                                alt={title}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                                                <span className="text-gray-400 dark:text-gray-500">
                                                    No Image
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="mb-2 line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] dark:text-white dark:group-hover:text-[var(--brand-primary)]">
                                            {title}
                                        </h3>
                                        <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                                            {excerpt}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {new Date(
                                                    item.published_at,
                                                ).toLocaleDateString(
                                                    lang === 'en'
                                                        ? 'en-US'
                                                        : lang === 'ar'
                                                          ? 'ar-SA'
                                                          : 'id-ID',
                                                    {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    },
                                                )}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="h-3.5 w-3.5" />
                                                {item.views}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                            {lang === 'en'
                                ? 'No articles in this category yet.'
                                : 'Belum ada berita di kategori ini.'}
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
