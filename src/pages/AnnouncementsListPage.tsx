import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Megaphone, Download } from 'lucide-react';
import { fetchAnnouncements } from '@/api/announcements';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';
import { Pagination } from '@/components/ui/Pagination';
import type { Announcement } from '@/types';

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
    if (locale === 'ar' && item.title_ar) return item.title_ar;
    if (locale === 'en' && item.title_en) return item.title_en;
    return item.title_id;
}

function stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function getExcerpt(item: Announcement, locale: string, length = 150): string {
    let content: string | null = null;
    if (locale === 'ar' && item.content_ar) content = item.content_ar;
    else if (locale === 'en' && item.content_en) content = item.content_en;
    else content = item.content_id;
    if (!content) return '';
    const text = stripHtml(content);
    return text.length > length ? `${text.substring(0, length)}...` : text;
}

export default function AnnouncementsListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const { lang, withLocale } = useLanguage();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['announcements', page],
        queryFn: () => fetchAnnouncements(page),
    });

    if (isLoading) return <Loading />;
    if (error || !data) return <ErrorState onRetry={() => refetch()} />;

    return (
        <div className="py-8 md:py-12">
            <div className="mx-auto max-w-7xl px-4">
                <div className="mb-8">
                    <Link
                        to={withLocale('/')}
                        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-[var(--brand-primary)] dark:text-gray-400 dark:hover:text-[var(--brand-primary)]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {lang === 'ar'
                            ? 'الرئيسية'
                            : lang === 'en'
                              ? 'Home'
                              : 'Beranda'}
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                        {lang === 'ar'
                            ? 'الإعلانات'
                            : lang === 'en'
                              ? 'Announcements'
                              : 'Pengumuman'}
                    </h1>
                    <div className="mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {data.meta.total}{' '}
                        {lang === 'ar'
                            ? 'إعلان'
                            : lang === 'en'
                              ? 'announcements'
                              : 'pengumuman'}
                    </p>
                </div>

                {data.data.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {data.data.map((item) => (
                            <Link
                                key={item.id}
                                to={withLocale(`/pengumuman/${item.slug}`)}
                                className="group overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800 dark:shadow-gray-900/30"
                            >
                                <div className="flex h-full flex-col">
                                    <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/30">
                                        {item.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt={getTitle(item, lang)}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <Megaphone className="h-12 w-12 text-amber-300 dark:text-amber-500/40" />
                                        )}
                                        <span className="absolute top-2 right-2 rounded-full bg-amber-600 px-3 py-0.5 text-xs font-semibold text-white">
                                            {lang === 'ar'
                                                ? 'إعلان'
                                                : lang === 'en'
                                                  ? 'Announcement'
                                                  : 'Pengumuman'}
                                        </span>
                                        {item.is_featured && (
                                            <span className="absolute top-2 left-2 rounded-full bg-yellow-500 px-3 py-0.5 text-xs font-semibold text-white">
                                                {lang === 'ar'
                                                    ? 'مميز'
                                                    : lang === 'en'
                                                      ? 'Featured'
                                                      : 'Unggulan'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col p-4">
                                        <h3 className="mb-2 line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] dark:text-white dark:group-hover:text-[var(--brand-primary)]">
                                            {getTitle(item, lang)}
                                        </h3>
                                        <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                                            {getExcerpt(item, lang)}
                                        </p>
                                        <div className="mt-auto flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {formatDate(
                                                    item.published_at,
                                                    lang,
                                                )}
                                            </span>
                                            {item.file_url && (
                                                <span className="flex items-center gap-1 text-[var(--brand-primary)] dark:text-[var(--brand-primary)]">
                                                    <Download className="h-3.5 w-3.5" />
                                                    {lang === 'ar'
                                                        ? 'مرفق'
                                                        : lang === 'en'
                                                          ? 'Attachment'
                                                          : 'Lampiran'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <Megaphone className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-500 dark:text-gray-400">
                            {lang === 'ar'
                                ? 'لا توجد إعلانات حالياً.'
                                : lang === 'en'
                                  ? 'No announcements available at the moment.'
                                  : 'Belum ada pengumuman saat ini.'}
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
