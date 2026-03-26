import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Clock,
    ExternalLink,
    Briefcase,
    Share2,
    Facebook,
    Twitter,
    Link2,
    Check,
} from 'lucide-react';
import { fetchCareerDetail } from '@/api/careers';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';

export default function CareerDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { lang, withLocale } = useLanguage();
    const [copied, setCopied] = useState(false);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['career-detail', id],
        queryFn: () => fetchCareerDetail(Number(id)),
        enabled: !!id,
    });

    if (isLoading) return <Loading />;
    if (error || !data) return <ErrorState onRetry={() => refetch()} />;

    const career = data.career;
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
    const requirements =
        lang === 'en'
            ? career.requirements_en
            : lang === 'ar'
              ? career.requirements_ar
              : career.requirements_id;

    const deadlinePassed = career.deadline
        ? new Date(career.deadline) < new Date()
        : false;

    const currentUrl =
        typeof window !== 'undefined' ? window.location.href : '';

    const handleCopyLink = () => {
        navigator.clipboard.writeText(currentUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(
            lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'id-ID',
            { day: 'numeric', month: 'long', year: 'numeric' },
        );
    };

    return (
        <>
            <article className="py-8 md:py-12">
                <div className="mx-auto max-w-4xl px-4">
                    {/* Breadcrumb */}
                    <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Link
                            to={withLocale('/karir')}
                            className="inline-flex items-center gap-1 transition-colors hover:text-[var(--brand-primary)] dark:hover:text-[var(--brand-primary)]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {lang === 'id'
                                ? 'Kembali ke Daftar Karir'
                                : 'Back to Career List'}
                        </Link>
                    </div>

                    {/* Title */}
                    <h1 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                        {title}
                    </h1>

                    {/* Meta Info */}
                    <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        {career.published_at && (
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(career.published_at)}
                            </span>
                        )}
                        {career.deadline && (
                            <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                <Clock className="h-4 w-4" />
                                {lang === 'id' ? 'Batas Akhir: ' : 'Deadline: '}
                                {formatDate(career.deadline)}
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-primary)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--brand-primary)] dark:bg-[var(--brand-primary)]/30 dark:text-[var(--brand-primary)]">
                            <Briefcase className="h-3 w-3" />
                            {career.status === 'open' && !deadlinePassed
                                ? lang === 'id'
                                    ? 'Dibuka'
                                    : 'Open'
                                : lang === 'id'
                                  ? 'Ditutup'
                                  : 'Closed'}
                        </span>
                    </div>

                    {/* Featured Image */}
                    {career.image && (
                        <div className="mb-8 overflow-hidden rounded-xl">
                            <img
                                src={career.image}
                                alt={title}
                                loading="lazy"
                                className="w-full object-cover"
                            />
                        </div>
                    )}

                    {/* Description */}
                    {desc && (
                        <section className="mb-8">
                            <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                                {lang === 'id' ? 'Deskripsi' : 'Description'}
                            </h2>
                            <div
                                className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 prose-a:text-[var(--brand-primary)]"
                                dangerouslySetInnerHTML={{ __html: desc }}
                            />
                        </section>
                    )}

                    {/* Requirements */}
                    {requirements && (
                        <section className="mb-8">
                            <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                                {lang === 'id' ? 'Persyaratan' : 'Requirements'}
                            </h2>
                            <div
                                className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 prose-a:text-[var(--brand-primary)]"
                                dangerouslySetInnerHTML={{
                                    __html: requirements,
                                }}
                            />
                        </section>
                    )}

                    {/* Registration Button */}
                    {career.registration_url &&
                        career.status === 'open' &&
                        !deadlinePassed && (
                            <div className="mb-8">
                                <a
                                    href={career.registration_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-secondary)]"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    {lang === 'id'
                                        ? 'Daftar Sekarang'
                                        : 'Apply Now'}
                                </a>
                            </div>
                        )}

                    {/* Social Sharing */}
                    <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <Share2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {lang === 'id' ? 'Bagikan:' : 'Share:'}
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
                                href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + currentUrl)}`}
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
                                        ? 'bg-brand'
                                        : 'bg-gray-500 hover:bg-gray-600'
                                }`}
                                aria-label={
                                    lang === 'id' ? 'Salin Tautan' : 'Copy Link'
                                }
                                title={
                                    copied
                                        ? lang === 'id'
                                            ? 'Link disalin!'
                                            : 'Link copied!'
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

            {/* Related Careers */}
            {data.related && data.related.length > 0 && (
                <section className="border-t border-gray-100 bg-gray-50 py-10 dark:border-gray-700 dark:bg-gray-900">
                    <div className="mx-auto max-w-4xl px-4">
                        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                            {lang === 'id'
                                ? 'Lowongan Karir Lainnya'
                                : 'Other Career Openings'}
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {data.related.map((item) => {
                                const relTitle =
                                    lang === 'en'
                                        ? item.title_en
                                        : lang === 'ar'
                                          ? item.title_ar
                                          : item.title_id;
                                return (
                                    <Link
                                        key={item.id}
                                        to={withLocale(`/karir/${item.id}`)}
                                        className="group rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
                                    >
                                        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] dark:text-white dark:group-hover:text-[var(--brand-primary)]">
                                            {relTitle}
                                        </h3>
                                        {item.deadline && (
                                            <span className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                                                <Clock className="h-3 w-3" />
                                                {formatDate(item.deadline)}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
