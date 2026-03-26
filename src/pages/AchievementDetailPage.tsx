import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import {
    Trophy,
    ArrowLeft,
    Calendar,
    Award,
    User,
    Share2,
    Facebook,
    Twitter,
    Link2,
    Check,
} from 'lucide-react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchAchievementDetail } from '@/api/achievements';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';
import type { Achievement } from '@/types';

function getTitle(item: Achievement, lang: string): string {
    if (lang === 'en' && item.title_en) return item.title_en;
    if (lang === 'ar' && item.title_ar) return item.title_ar;
    return item.title_id;
}

function getDescription(item: Achievement, lang: string): string {
    if (lang === 'en' && item.description_en) return item.description_en;
    if (lang === 'ar' && item.description_ar) return item.description_ar;
    return item.description_id || '';
}

function getRankingBadge(ranking: string | null): {
    bg: string;
    text: string;
    darkBg: string;
    darkText: string;
} {
    if (!ranking)
        return {
            bg: 'bg-gray-100',
            text: 'text-gray-700',
            darkBg: 'dark:bg-gray-700',
            darkText: 'dark:text-gray-300',
        };
    const r = ranking.toLowerCase();
    if (
        r.includes('1') ||
        r.includes('i') ||
        r.includes('pertama') ||
        r.includes('first') ||
        r.includes('gold') ||
        r.includes('emas')
    ) {
        return {
            bg: 'bg-yellow-100',
            text: 'text-yellow-800',
            darkBg: 'dark:bg-yellow-900/40',
            darkText: 'dark:text-yellow-300',
        };
    }
    if (
        r.includes('2') ||
        r.includes('ii') ||
        r.includes('kedua') ||
        r.includes('second') ||
        r.includes('silver') ||
        r.includes('perak')
    ) {
        return {
            bg: 'bg-gray-200',
            text: 'text-gray-700',
            darkBg: 'dark:bg-gray-600',
            darkText: 'dark:text-gray-200',
        };
    }
    if (
        r.includes('3') ||
        r.includes('iii') ||
        r.includes('ketiga') ||
        r.includes('third') ||
        r.includes('bronze') ||
        r.includes('perunggu')
    ) {
        return {
            bg: 'bg-orange-100',
            text: 'text-orange-800',
            darkBg: 'dark:bg-orange-900/40',
            darkText: 'dark:text-orange-300',
        };
    }
    return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        darkBg: 'dark:bg-emerald-900/30',
        darkText: 'dark:text-[var(--brand-primary)]',
    };
}

export default function AchievementDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { lang, withLocale } = useLanguage();
    const [copied, setCopied] = useState(false);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['achievement-detail', id],
        queryFn: () => fetchAchievementDetail(id!),
        enabled: !!id,
    });

    if (isLoading) return <Loading />;
    if (error || !data) return <ErrorState onRetry={() => refetch()} />;

    const { achievement, related } = data;
    const title = getTitle(achievement, lang);
    const description = getDescription(achievement, lang);
    const currentUrl =
        typeof window !== 'undefined' ? window.location.href : '';

    const handleCopyLink = () => {
        navigator.clipboard.writeText(currentUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const badge = getRankingBadge(achievement.ranking);

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>

            <article className="py-8 md:py-12">
                <div className="mx-auto max-w-4xl px-4">
                    {/* Back link */}
                    <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Link
                            to={withLocale('/prestasi-mahasiswa')}
                            className="inline-flex items-center gap-1 transition-colors hover:text-[var(--brand-primary)] dark:hover:text-[var(--brand-primary)]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {lang === 'id'
                                ? 'Kembali ke Prestasi Mahasiswa'
                                : lang === 'ar'
                                  ? 'العودة إلى إنجازات الطلاب'
                                  : 'Back to Student Achievements'}
                        </Link>
                    </div>

                    {/* Ranking badge */}
                    {achievement.ranking && (
                        <div className="mb-4">
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${badge.bg} ${badge.text} ${badge.darkBg} ${badge.darkText}`}
                            >
                                <Trophy className="h-4 w-4" />
                                {achievement.ranking}
                            </span>
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                        {title}
                    </h1>

                    {/* Meta row */}
                    <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {achievement.student_name}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {achievement.year}
                        </span>
                        {achievement.category && (
                            <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
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

                    {/* Featured image or placeholder */}
                    <div className="mb-8 overflow-hidden rounded-xl">
                        {achievement.image ? (
                            <img
                                src={achievement.image_url || achievement.image}
                                alt={title}
                                loading="lazy"
                                className="w-full object-cover"
                            />
                        ) : (
                            <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)]">
                                <Trophy className="h-20 w-20 text-white/30" />
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {description && (
                        <section className="mb-8">
                            <div
                                className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-[var(--brand-primary)]"
                                dangerouslySetInnerHTML={{
                                    __html: description,
                                }}
                            />
                        </section>
                    )}

                    {/* Social Sharing */}
                    <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <Share2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {lang === 'id'
                                    ? 'Bagikan:'
                                    : lang === 'ar'
                                      ? 'مشاركة:'
                                      : 'Share:'}
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
                                        ? 'bg-emerald-600'
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

            {/* Related achievements */}
            {related.length > 0 && (
                <section className="border-t border-gray-100 bg-gray-50 py-10 dark:border-gray-800 dark:bg-gray-800/50">
                    <div className="mx-auto max-w-4xl px-4">
                        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                            {lang === 'id'
                                ? 'Prestasi Lainnya'
                                : lang === 'ar'
                                  ? 'إنجازات أخرى'
                                  : 'Other Achievements'}
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((item) => (
                                <Link
                                    key={item.id}
                                    to={withLocale(`/prestasi/${item.id}`)}
                                    className="group overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800 dark:shadow-gray-900/30"
                                >
                                    <div className="relative aspect-video overflow-hidden">
                                        {item.image ? (
                                            <img
                                                src={
                                                    item.image_url || item.image
                                                }
                                                alt={getTitle(item, lang)}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)]">
                                                <Trophy className="h-8 w-8 text-white/40" />
                                            </div>
                                        )}
                                        {item.ranking && (
                                            <span className="absolute top-2 right-2 rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-bold text-white">
                                                {item.ranking}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] dark:text-white dark:group-hover:text-[var(--brand-primary)]">
                                            {getTitle(item, lang)}
                                        </h3>
                                        <p className="text-xs font-medium text-[var(--brand-primary)] dark:text-[var(--brand-primary)]">
                                            {item.student_name}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
