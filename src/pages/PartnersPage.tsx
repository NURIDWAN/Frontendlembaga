import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { fetchPartners } from '@/api/partners';
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

export default function PartnersPage() {
    const { lang, withLocale } = useLanguage();
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['partners'],
        queryFn: fetchPartners,
    });

    if (isLoading) return <Loading />;
    if (error || !data) return <ErrorState onRetry={() => refetch()} />;

    const { partners, categories } = data;
    const filtered = activeCategory
        ? partners.filter((p) => p.category === activeCategory)
        : partners;

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
                        {lang === 'en'
                            ? 'Home'
                            : lang === 'ar'
                              ? 'الرئيسية'
                              : 'Beranda'}
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                        {lang === 'en'
                            ? 'Collaboration & Partners'
                            : lang === 'ar'
                              ? 'التعاون والشراكات'
                              : 'Kolaborasi & Mitra'}
                    </h1>
                    <div className="mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {filtered.length}{' '}
                        {lang === 'en'
                            ? 'partners'
                            : lang === 'ar'
                              ? 'شركاء'
                              : 'mitra'}
                    </p>

                    <div className="mt-3">
                        <Link
                            to={withLocale('/mitra-semua')}
                            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-secondary)] dark:text-[var(--brand-primary)]"
                        >
                            {lang === 'en'
                                ? 'View All Partners/Collaborators'
                                : lang === 'ar'
                                  ? 'عرض جميع الشركاء/المتعاونين'
                                  : 'Lihat Semua Mitra/Kolaborator'}
                            <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>

                {/* Category Filter */}
                {categories.length > 0 && (
                    <div className="mb-6 flex flex-wrap gap-2">
                        <button
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
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() =>
                                    setActiveCategory(
                                        activeCategory === cat ? null : cat,
                                    )
                                }
                                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                                    activeCategory === cat
                                        ? 'bg-[var(--brand-primary)] text-white'
                                        : 'border border-gray-300 text-gray-700 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] dark:border-gray-600 dark:text-gray-300 dark:hover:border-[var(--brand-primary)] dark:hover:text-[var(--brand-primary)]'
                                }`}
                            >
                                {getCategoryLabel(cat, lang)}
                            </button>
                        ))}
                    </div>
                )}

                {/* Partners Grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {filtered.map((partner) => (
                            <Link
                                key={partner.id}
                                to={withLocale(`/mitra/${partner.id}`)}
                                className="group flex flex-col items-center rounded-xl bg-white p-4 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
                            >
                                {partner.logo_url || partner.logo ? (
                                    <img
                                        src={partner.logo_url || partner.logo!}
                                        alt={partner.name}
                                        loading="lazy"
                                        className="mb-3 h-20 w-full object-contain transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="mb-3 flex h-20 w-full items-center justify-center rounded bg-gray-100 dark:bg-gray-700">
                                        <span className="text-2xl font-bold text-gray-300 dark:text-gray-500">
                                            {partner.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <p className="mb-1 text-center text-sm font-medium text-gray-900 group-hover:text-[var(--brand-primary)] dark:text-white dark:group-hover:text-[var(--brand-primary)]">
                                    {partner.name}
                                </p>
                                {partner.category && (
                                    <span className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                                        {getCategoryLabel(
                                            partner.category,
                                            lang,
                                        )}
                                    </span>
                                )}
                                {partner.website && (
                                    <span className="inline-flex items-center gap-1 text-xs text-[var(--brand-primary)] dark:text-[var(--brand-primary)]">
                                        <ExternalLink className="h-3 w-3" />
                                        Website
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                            {lang === 'en'
                                ? 'No partners available yet.'
                                : lang === 'ar'
                                  ? 'لا يوجد شركاء حتى الآن.'
                                  : 'Belum ada mitra.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
