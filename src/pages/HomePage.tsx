import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { fetchHomePage } from '@/api/pages';
import { useInstitution } from '@/context/InstitutionContext';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';
import { WebSiteJsonLd } from '@/components/seo/json-ld';
import {
    SectionRenderer,
    preloadSectionComponents,
    type SectionWithData,
} from '@/components/public/sections/SectionRenderer';

export default function HomePage() {
    const { institution } = useInstitution();
    const { lang, withLocale } = useLanguage();

    const {
        data: page,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['homepage'],
        queryFn: fetchHomePage,
        staleTime: 1000 * 60 * 5,
    });

    // Map sections to SectionWithData format - trust backend order (no client sort)
    const sectionsWithData: SectionWithData[] = useMemo(() => {
        if (!page?.sections) return [];
        return page.sections
            .filter((s) => s.is_active)
            .map((s) => ({
                id: s.id,
                type: s.type,
                data: s.data,
                order: s.order,
                is_active: s.is_active,
                dynamic_data: s.dynamic_data,
            }));
    }, [page?.sections]);

    // Preload priority section components
    const sectionTypes = useMemo(
        () => sectionsWithData.map((s) => s.type),
        [sectionsWithData],
    );

    useEffect(() => {
        if (sectionTypes.length === 0) return;
        preloadSectionComponents(
            sectionTypes.filter((type) =>
                ['slider', 'hero', 'quick_links', 'berita_agenda'].includes(
                    type,
                ),
            ),
        );
    }, [sectionTypes]);

    if (isLoading) return <Loading />;
    if (error || !page) return <ErrorState onRetry={() => refetch()} />;

    const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

    return (
        <>
            <Helmet>
                <title>{page.meta_title || institution?.name || 'Beranda'}</title>
                <meta
                    name="description"
                    content={
                        page.meta_description ||
                        `Website resmi ${institution?.name || 'Lembaga'}`
                    }
                />
                {page.meta_keywords && (
                    <meta name="keywords" content={page.meta_keywords} />
                )}
            </Helmet>
            <WebSiteJsonLd
                name={institution?.name || ''}
                url={siteUrl}
                searchUrl={`${siteUrl}${withLocale('/pencarian')}?q={search_term_string}`}
            />

            {/* Render sections in DB order via SectionRenderer */}
            <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <SectionRenderer sections={sectionsWithData} locale={lang} />
            </div>
        </>
    );
}
