import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { fetchPartnerDetail } from '@/api/partners';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';

function getCategoryLabel(category: string, lang: string): string {
    const labels: Record<string, Record<string, string>> = {
        akreditasi: {
            id: 'Akreditasi',
            en: 'Accreditation',
            ar: 'الاعتماد',
        },
        kerjasama: { id: 'Kerjasama', en: 'Cooperation', ar: 'التعاون' },
        industri: { id: 'Industri', en: 'Industry', ar: 'الصناعة' },
    };
    return labels[category]?.[lang] || category;
}

export default function PartnerDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { lang, withLocale } = useLanguage();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['partner-detail', id],
        queryFn: () => fetchPartnerDetail(id!),
        enabled: !!id,
    });

    if (isLoading) return <Loading />;
    if (error || !data) return <ErrorState onRetry={() => refetch()} />;

    const { partner, related } = data;

    return (
        <>
            <Helmet>
                <title>{partner.name}</title>
            </Helmet>

            <article className="py-8 md:py-12">
                <div className="mx-auto max-w-3xl px-4">
                    {/* Back link */}
                    <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Link
                            to={withLocale('/mitra')}
                            className="inline-flex items-center gap-1 transition-colors hover:text-[var(--brand-primary)] dark:hover:text-[var(--brand-primary)]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {lang === 'id'
                                ? 'Kembali ke Mitra'
                                : lang === 'ar'
                                  ? 'العودة إلى الشركاء'
                                  : 'Back to Partners'}
                        </Link>
                    </div>

                    {/* Logo */}
                    <div className="mb-6 flex justify-center">
                        {partner.logo ? (
                            <img
                                src={partner.logo_url || partner.logo}
                                alt={partner.name}
                                className="max-h-40 max-w-xs object-contain"
                            />
                        ) : (
                            <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)]">
                                <span className="text-4xl font-bold text-white">
                                    {partner.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Name */}
                    <h1 className="mb-3 text-center text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                        {partner.name}
                    </h1>

                    {/* Category badge */}
                    {partner.category && (
                        <div className="mb-6 flex justify-center">
                            <span className="rounded-full bg-[var(--brand-primary)]/10 px-4 py-1 text-sm font-medium text-[var(--brand-primary)] dark:bg-[var(--brand-primary)]/20 dark:text-[var(--brand-primary)]">
                                {getCategoryLabel(partner.category, lang)}
                            </span>
                        </div>
                    )}

                    {/* Website button */}
                    {partner.website && (
                        <div className="mb-8 flex justify-center">
                            <a
                                href={partner.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-secondary)]"
                            >
                                <ExternalLink className="h-4 w-4" />
                                {lang === 'id'
                                    ? 'Kunjungi Website'
                                    : lang === 'ar'
                                      ? 'زيارة الموقع'
                                      : 'Visit Website'}
                            </a>
                        </div>
                    )}
                </div>
            </article>

            {/* Related partners */}
            {related.length > 0 && (
                <section className="border-t border-gray-100 bg-gray-50 py-10 dark:border-gray-800 dark:bg-gray-800/50">
                    <div className="mx-auto max-w-4xl px-4">
                        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                            {lang === 'id'
                                ? 'Mitra Lainnya'
                                : lang === 'ar'
                                  ? 'شركاء آخرون'
                                  : 'Other Partners'}
                        </h2>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {related.map((item) => (
                                <Link
                                    key={item.id}
                                    to={withLocale(`/mitra/${item.id}`)}
                                    className="group flex flex-col items-center rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800 dark:shadow-gray-900/30"
                                >
                                    {item.logo ? (
                                        <img
                                            src={item.logo_url || item.logo}
                                            alt={item.name}
                                            loading="lazy"
                                            className="mb-3 h-16 w-full object-contain"
                                        />
                                    ) : (
                                        <div className="mb-3 flex h-16 w-full items-center justify-center rounded bg-gray-100 dark:bg-gray-700">
                                            <span className="text-xl font-bold text-gray-300 dark:text-gray-500">
                                                {item.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <p className="text-center text-xs font-medium text-gray-900 group-hover:text-[var(--brand-primary)] dark:text-white dark:group-hover:text-[var(--brand-primary)]">
                                        {item.name}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
