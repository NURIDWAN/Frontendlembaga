import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import {
    Calendar,
    Eye,
    User,
    ArrowLeft,
    Tag,
    Share2,
    Facebook,
    Twitter,
    Link2,
    Check,
} from 'lucide-react';
import { fetchNewsDetail } from '@/api/news';
import { useLanguage } from '@/context/LanguageContext';
import { useInstitution } from '@/context/InstitutionContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';

export default function NewsDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const { lang, withLocale } = useLanguage();
    const { institution } = useInstitution();
    const [copied, setCopied] = useState(false);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['news-detail', slug],
        queryFn: () => fetchNewsDetail(slug!),
        enabled: !!slug,
    });

    if (isLoading) return <Loading />;
    if (error || !data) return <ErrorState onRetry={() => refetch()} />;

    const { news, related, seo_meta } = data;
    const title =
        lang === 'en'
            ? news.title_en
            : lang === 'ar'
              ? news.title_ar
              : news.title_id;
    const body =
        lang === 'en'
            ? news.body_en
            : lang === 'ar'
              ? news.body_ar
              : news.body_id;

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

    const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

    return (
        <>
            {/* SEO */}
            {seo_meta && <title>{seo_meta.meta_title || title}</title>}
            <ArticleJsonLd
                title={title}
                url={currentUrl}
                image={news.image_url ?? news.image_path ?? undefined}
                datePublished={news.published_at}
                authorName={news.author?.name}
                publisherName={institution?.name || ''}
                publisherLogo={institution?.logo_url ?? undefined}
                description={seo_meta?.meta_description || undefined}
            />
            <BreadcrumbJsonLd
                items={[
                    {
                        name: lang === 'en' ? 'Home' : 'Beranda',
                        url: siteUrl,
                    },
                    {
                        name: lang === 'en' ? 'News' : 'Berita',
                        url: `${siteUrl}${withLocale('/berita')}`,
                    },
                    { name: title, url: currentUrl },
                ]}
            />

            <article className="py-8 md:py-12">
                <div className="mx-auto max-w-4xl px-4">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <Link
                            to={withLocale('/')}
                            className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-[var(--brand-primary)] dark:text-gray-400 dark:hover:text-[var(--brand-primary)]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {lang === 'id'
                                ? 'Kembali ke Beranda'
                                : lang === 'en'
                                  ? 'Back to Home'
                                  : 'العودة إلى الرئيسية'}
                        </Link>
                    </div>

                    {/* Category */}
                    {news.category && (
                        <Link
                            to={withLocale(
                                `/berita/kategori/${news.category.slug}`,
                            )}
                            className="mb-3 inline-block rounded bg-[var(--brand-primary)] px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-[var(--brand-secondary)]"
                        >
                            {lang === 'en'
                                ? news.category.name_en
                                : news.category.name_id}
                        </Link>
                    )}

                    {/* Title */}
                    <h1 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                        {title}
                    </h1>

                    {/* Meta */}
                    <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        {news.author && (
                            <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {news.author.name}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(news.published_at)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {news.views}{' '}
                            {lang === 'id' ? 'kali dilihat' : 'views'}
                        </span>
                    </div>

                    {/* Featured image */}
                    {news.image_path && (
                        <div className="mb-8 overflow-hidden rounded-xl">
                            <img
                                src={news.image_path}
                                alt={title}
                                loading="lazy"
                                className="w-full object-cover"
                            />
                        </div>
                    )}

                    {/* Body */}
                    <div
                        className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 prose-a:text-[var(--brand-primary)] prose-img:rounded-lg"
                        dangerouslySetInnerHTML={{ __html: body }}
                    />

                    {/* Tags */}
                    {news.tags && news.tags.length > 0 && (
                        <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-6 dark:border-gray-700">
                            <Tag className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            {news.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Social Sharing */}
                    <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
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

            {/* Related Articles */}
            {related.length > 0 && (
                <section className="border-t border-gray-100 bg-gray-50 py-10 dark:border-gray-700 dark:bg-gray-900">
                    <div className="mx-auto max-w-4xl px-4">
                        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                            {lang === 'id'
                                ? 'Berita Terkait'
                                : 'Related Articles'}
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {related.map((item) => {
                                const relTitle =
                                    lang === 'en'
                                        ? item.title_en
                                        : lang === 'ar'
                                          ? item.title_ar
                                          : item.title_id;
                                return (
                                    <Link
                                        key={item.id}
                                        to={withLocale(`/berita/${item.slug}`)}
                                        className="group flex gap-3 rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
                                    >
                                        {item.image_path ? (
                                            <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg">
                                                <img
                                                    src={item.image_path}
                                                    alt={relTitle}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex h-20 w-28 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                                    No Image
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex flex-col justify-center">
                                            <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] dark:text-white dark:group-hover:text-[var(--brand-primary)]">
                                                {relTitle}
                                            </h3>
                                            <span className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                                {formatDate(item.published_at)}
                                            </span>
                                        </div>
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
