import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Megaphone,
    Download,
    Share2,
    Facebook,
    Twitter,
    Link2,
    Check,
} from 'lucide-react';
import { fetchAnnouncementDetail } from '@/api/announcements';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';
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

function getContent(item: Announcement, locale: string): string {
    if (locale === 'ar' && item.content_ar) return item.content_ar;
    if (locale === 'en' && item.content_en) return item.content_en;
    return item.content_id || '';
}

export default function AnnouncementDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const { lang, withLocale } = useLanguage();
    const [copied, setCopied] = useState(false);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['announcement-detail', slug],
        queryFn: () => fetchAnnouncementDetail(slug!),
        enabled: !!slug,
    });

    if (isLoading) return <Loading />;
    if (error || !data) return <ErrorState onRetry={() => refetch()} />;

    const { announcement, related } = data;
    const title = getTitle(announcement, lang);
    const content = getContent(announcement, lang);
    const currentUrl =
        typeof window !== 'undefined' ? window.location.href : '';

    const handleCopyLink = () => {
        navigator.clipboard.writeText(currentUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <>
            <article className="py-8 md:py-12">
                <div className="mx-auto max-w-4xl px-4">
                    <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Link
                            to={withLocale('/pengumuman')}
                            className="inline-flex items-center gap-1 transition-colors hover:text-[var(--brand-primary)]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {lang === 'ar'
                                ? 'العودة إلى الإعلانات'
                                : lang === 'en'
                                  ? 'Back to Announcements'
                                  : 'Kembali ke Daftar Pengumuman'}
                        </Link>
                    </div>

                    <h1 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                        {title}
                    </h1>

                    <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(announcement.published_at, lang)}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                            <Megaphone className="h-3 w-3" />
                            {lang === 'ar'
                                ? 'إعلان'
                                : lang === 'en'
                                  ? 'Announcement'
                                  : 'Pengumuman'}
                        </span>
                        {announcement.is_featured && (
                            <span className="inline-flex items-center rounded-full bg-yellow-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                                {lang === 'ar'
                                    ? 'مميز'
                                    : lang === 'en'
                                      ? 'Featured'
                                      : 'Unggulan'}
                            </span>
                        )}
                    </div>

                    {announcement.image_url && (
                        <div className="mb-8 overflow-hidden rounded-xl">
                            <img
                                src={announcement.image_url}
                                alt={title}
                                className="w-full object-cover"
                            />
                        </div>
                    )}

                    {content && (
                        <section className="mb-8">
                            <div
                                className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 prose-a:text-[var(--brand-primary)]"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        </section>
                    )}

                    {announcement.file_url && (
                        <div className="mb-8">
                            <a
                                href={announcement.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-secondary)]"
                            >
                                <Download className="h-4 w-4" />
                                {lang === 'ar'
                                    ? 'تحميل المرفق'
                                    : lang === 'en'
                                      ? 'Download Attachment'
                                      : 'Unduh Lampiran'}
                                {announcement.original_file_name && (
                                    <span className="ml-1 text-xs opacity-75">
                                        ({announcement.original_file_name})
                                    </span>
                                )}
                            </a>
                        </div>
                    )}

                    <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <Share2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {lang === 'ar'
                                    ? 'مشاركة:'
                                    : lang === 'en'
                                      ? 'Share:'
                                      : 'Bagikan:'}
                            </span>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700"
                                aria-label="Share on Facebook"
                            >
                                <Facebook className="h-4 w-4" />
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-sky-500 p-2 text-white transition-colors hover:bg-sky-600"
                                aria-label="Share on Twitter"
                            >
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(`${title} ${currentUrl}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-green-600 p-2 text-white transition-colors hover:bg-green-700"
                                aria-label="Share on WhatsApp"
                            >
                                <svg
                                    className="h-4 w-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                </svg>
                            </a>
                            <button
                                onClick={handleCopyLink}
                                className={`rounded-full p-2 text-white transition-colors ${
                                    copied
                                        ? 'bg-emerald-600'
                                        : 'bg-gray-500 hover:bg-gray-600'
                                }`}
                                aria-label={
                                    lang === 'ar'
                                        ? 'نسخ الرابط'
                                        : lang === 'id'
                                          ? 'Salin Tautan'
                                          : 'Copy Link'
                                }
                            >
                                {copied ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Link2 className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </article>

            {related.length > 0 && (
                <section className="border-t border-gray-100 bg-gray-50 py-10 dark:border-gray-800 dark:bg-gray-800/50">
                    <div className="mx-auto max-w-4xl px-4">
                        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                            {lang === 'ar'
                                ? 'إعلانات أخرى'
                                : lang === 'en'
                                  ? 'Other Announcements'
                                  : 'Pengumuman Lainnya'}
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((item) => (
                                <Link
                                    key={item.id}
                                    to={withLocale(`/pengumuman/${item.slug}`)}
                                    className="group rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800 dark:shadow-gray-900/30"
                                >
                                    <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] dark:text-white dark:group-hover:text-[var(--brand-primary)]">
                                        {getTitle(item, lang)}
                                    </h3>
                                    <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(item.published_at, lang)}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
