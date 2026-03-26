import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Building2 } from 'lucide-react';
import { useState } from 'react';
import { fetchAllPartners } from '@/api/partners';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';

function getCategoryLabel(category: string, lang: string): string {
    const labels: Record<string, Record<string, string>> = {
        akreditasi: { id: 'Akreditasi', en: 'Accreditation', ar: 'الاعتماد' },
        kerjasama: { id: 'Kerjasama', en: 'Cooperation', ar: 'التعاون' },
        industri: { id: 'Industri', en: 'Industry', ar: 'الصناعة' },
    };

    return labels[category]?.[lang] || category;
}

export default function AllPartnersPage() {
    const { lang, withLocale } = useLanguage();
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['partners', 'all'],
        queryFn: fetchAllPartners,
    });

    const partners = data?.partners || [];
    const categories = data?.categories ?? [];

    const filteredPartners = activeCategory
        ? partners.filter((partner) => partner.category === activeCategory)
        : partners;

    if (isLoading) return <Loading />;
    if (error || !data) return <ErrorState onRetry={() => refetch()} />;

    return (
        <div className="py-8 md:py-12">
            <div className="mx-auto max-w-7xl px-4">
                <div className="mb-8 space-y-3">
                    <Link
                        to={withLocale('/mitra')}
                        className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-[var(--brand-primary)] dark:text-gray-400 dark:hover:text-[var(--brand-primary)]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {lang === 'en'
                            ? 'Back to Partners'
                            : lang === 'ar'
                              ? 'العودة إلى صفحة الشركاء'
                              : 'Kembali ke Mitra'}
                    </Link>

                    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                        {lang === 'en'
                            ? 'All Partners & Collaborators'
                            : lang === 'ar'
                              ? 'جميع الشركاء والمتعاونين'
                              : 'Semua Mitra & Kolaborator'}
                    </h1>

                    <div className="mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {filteredPartners.length}{' '}
                        {lang === 'en'
                            ? 'registered partners/collaborators'
                            : lang === 'ar'
                              ? 'شريك/متعاون مسجل'
                              : 'mitra/kolaborator terdaftar'}
                    </p>
                </div>

                {categories.length > 0 && (
                    <div className="mb-6 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveCategory(null)}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                                activeCategory === null
                                    ? 'bg-[var(--brand-primary)] text-white'
                                    : 'border border-gray-300 text-gray-700 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] dark:border-gray-600 dark:text-gray-300 dark:hover:border-[var(--brand-primary)] dark:hover:text-[var(--brand-primary)]'
                            }`}
                        >
                            {lang === 'en'
                                ? 'All'
                                : lang === 'ar'
                                  ? 'الكل'
                                  : 'Semua'}
                        </button>

                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() =>
                                    setActiveCategory(
                                        activeCategory === category
                                            ? null
                                            : category,
                                    )
                                }
                                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                                    activeCategory === category
                                        ? 'bg-[var(--brand-primary)] text-white'
                                        : 'border border-gray-300 text-gray-700 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] dark:border-gray-600 dark:text-gray-300 dark:hover:border-[var(--brand-primary)] dark:hover:text-[var(--brand-primary)]'
                                }`}
                            >
                                {getCategoryLabel(category, lang)}
                            </button>
                        ))}
                    </div>
                )}

                {filteredPartners.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredPartners.map((partner) => (
                            <article
                                key={partner.id}
                                className="group rounded-xl bg-white p-4 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
                            >
                                <Link
                                    to={withLocale(`/mitra/${partner.id}`)}
                                    className="block"
                                >
                                    <div className="mb-3 flex h-24 items-center justify-center overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-700/40">
                                        {partner.logo_url || partner.logo ? (
                                            <img
                                                src={
                                                    partner.logo_url ||
                                                    partner.logo!
                                                }
                                                alt={partner.name}
                                                loading="lazy"
                                                className="h-full w-full object-contain p-2"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Building2 className="h-5 w-5" />
                                                <span className="text-xs">
                                                    {lang === 'en'
                                                        ? 'No Logo'
                                                        : lang === 'ar'
                                                          ? 'بدون شعار'
                                                          : 'Tanpa Logo'}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <h2 className="line-clamp-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-[var(--brand-primary)] dark:text-white dark:group-hover:text-[var(--brand-primary)]">
                                        {partner.name}
                                    </h2>

                                    {partner.category && (
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            {getCategoryLabel(
                                                partner.category,
                                                lang,
                                            )}
                                        </p>
                                    )}
                                </Link>

                                {partner.website && (
                                    <a
                                        href={partner.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--brand-primary)] hover:underline dark:text-[var(--brand-primary)]"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        Website
                                    </a>
                                )}
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                        {lang === 'en'
                            ? 'No partners/collaborators in this category yet.'
                            : lang === 'ar'
                              ? 'لا يوجد شركاء/متعاونون لهذه الفئة حتى الآن.'
                              : 'Belum ada mitra/kolaborator untuk kategori ini.'}
                    </div>
                )}
            </div>
        </div>
    );
}
