import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { fetchHome } from '@/api/home';
import { useInstitution } from '@/context/InstitutionContext';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';
import { WebSiteJsonLd } from '@/components/seo/json-ld';
import HeroSlider from '@/components/home/HeroSlider';
import QuickLinks from '@/components/home/QuickLinks';
import LatestNews from '@/components/home/LatestNews';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import PartnersSection from '@/components/home/PartnersSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import AnnouncementsSection from '@/components/home/AnnouncementsSection';
import LecturerColumnSection from '@/components/home/LecturerColumnSection';
import CareerSection from '@/components/home/CareerSection';

export default function HomePage() {
    const { institution } = useInstitution();
    const { withLocale } = useLanguage();
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['home'],
        queryFn: fetchHome,
        staleTime: 1000 * 60 * 5,
    });

    if (isLoading) return <Loading />;
    if (error || !data) return <ErrorState onRetry={() => refetch()} />;

    const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

    return (
        <>
            <Helmet>
                <title>{institution?.name || 'Beranda'}</title>
                <meta
                    name="description"
                    content={`Website resmi ${institution?.name || 'Lembaga'}`}
                />
            </Helmet>
            <WebSiteJsonLd
                name={institution?.name || ''}
                url={siteUrl}
                searchUrl={`${siteUrl}${withLocale('/pencarian')}?q={search_term_string}`}
            />

            {/* Section 1: Hero Slider */}
            {data.sliders.length > 0 && <HeroSlider sliders={data.sliders} />}

            {/* Section 2: Quick Links */}
            {data.quick_links.length > 0 && (
                <QuickLinks
                    quickLinks={data.quick_links}
                    hasSlider={data.sliders.length > 0}
                />
            )}

            {/* Section 3: News / Berita */}
            {data.news.length > 0 && <LatestNews news={data.news} />}

            {/* Section 4: Events / Agenda */}
            {data.events.length > 0 && <UpcomingEvents events={data.events} />}

            {/* Section 5: Partners / Kolaborasi */}
            {data.partners.length > 0 && (
                <PartnersSection partners={data.partners} />
            )}

            {/* Section 6: Testimonials */}
            {data.testimonials.length > 0 && (
                <TestimonialsSection testimonials={data.testimonials} />
            )}

            {/* Section 7: Pengumuman */}
            {data.announcements.length > 0 && (
                <AnnouncementsSection announcements={data.announcements} />
            )}

            {/* Section 8: Kolom Dosen */}
            {data.lecturer_columns.length > 0 && (
                <LecturerColumnSection
                    lecturerColumns={data.lecturer_columns}
                />
            )}

            {/* Section 9: Informasi Karir */}
            {data.career_posts.length > 0 && (
                <CareerSection careerPosts={data.career_posts} />
            )}
        </>
    );
}
