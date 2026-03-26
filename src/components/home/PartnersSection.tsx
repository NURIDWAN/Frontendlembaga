import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import type { Partner } from '@/types';

interface PartnersSectionProps {
    partners: Partner[];
}

export default function PartnersSection({ partners }: PartnersSectionProps) {
    const { lang } = useLanguage();

    if (partners.length === 0) return null;

    // Group partners by category
    const grouped = partners.reduce<Record<string, Partner[]>>(
        (acc, partner) => {
            const key = partner.category || 'lainnya';
            if (!acc[key]) acc[key] = [];
            acc[key].push(partner);
            return acc;
        },
        {},
    );

    const categoryLabels: Record<
        string,
        { id: string; en: string; ar?: string }
    > = {
        akreditasi: {
            id: 'Akreditasi & Sertifikasi',
            en: 'Accreditation & Certification',
            ar: 'الاعتماد والشهادات',
        },
        kerjasama: { id: 'Kerjasama', en: 'Partnerships', ar: 'شراكات' },
        industri: {
            id: 'Mitra Industri',
            en: 'Industry Partners',
            ar: 'شركاء الصناعة',
        },
    };

    return (
        <section className="bg-gray-50 py-12 md:py-16 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-4">
                {/* Section Header */}
                <div className="mb-10 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                        {lang === 'ar'
                            ? 'التعاون والشركاء'
                            : lang === 'en'
                              ? 'Collaboration & Partners'
                              : 'Kolaborasi & Mitra'}
                    </h2>
                    <div className="mx-auto mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
                        {lang === 'ar'
                            ? 'نحن نتعاون مع مؤسسات مختلفة لتحسين جودة التعليم والخدمات.'
                            : lang === 'en'
                              ? 'We collaborate with various institutions to improve the quality of education and services.'
                              : 'Kami berkolaborasi dengan berbagai institusi untuk meningkatkan kualitas pendidikan dan layanan.'}
                    </p>
                </div>

                {/* Partner Groups */}
                {Object.entries(grouped).map(([category, items]) => {
                    const label = categoryLabels[category] || {
                        id: category,
                        en: category,
                    };
                    return (
                        <div key={category} className="mb-8 last:mb-0">
                            <h3 className="mb-4 text-center text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                {lang === 'ar' && label.ar
                                    ? label.ar
                                    : lang === 'en'
                                      ? label.en
                                      : label.id}
                            </h3>
                            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
                                {items.map((partner) => (
                                    <PartnerLogo
                                        key={partner.id}
                                        partner={partner}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* View All Partners Button */}
                <div className="mt-12 flex justify-center">
                    <Link
                        to={`/${lang}/mitra`}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm outline-none ring-[var(--brand-primary)] drop-shadow-sm transition-all hover:bg-gray-50 hover:text-[var(--brand-primary)] focus-visible:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        {lang === 'ar'
                            ? 'عرض جميع الشركاء'
                            : lang === 'en'
                              ? 'View All Partners'
                              : 'Lihat Semua Mitra'}
                    </Link>
                </div>
            </div>
        </section>
    );
}

function PartnerLogo({ partner }: { partner: Partner }) {
    const { withLocale } = useLanguage();
    const partnerLogo = partner.logo_url || partner.logo;

    const content = partnerLogo ? (
        <img
            src={partnerLogo}
            alt={partner.name}
            loading="lazy"
            className="h-12 w-auto max-w-[140px] object-contain grayscale transition-all hover:grayscale-0 md:h-16 md:max-w-[160px]"
        />
    ) : (
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {partner.name}
        </span>
    );

    return (
        <Link
            to={withLocale(`/mitra/${partner.id}`)}
            className="flex items-center justify-center p-2 transition-transform hover:scale-105"
            title={partner.name}
        >
            {content}
        </Link>
    );
}
