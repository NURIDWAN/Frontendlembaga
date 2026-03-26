import { Routes, Route, Navigate, Outlet, useParams } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '@/components/layout/Layout';
import { LoadingPage } from '@/components/ui/Loading';

// Lazy-loaded pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const NewsListPage = lazy(() => import('@/pages/NewsListPage'));
const AnnouncementsListPage = lazy(
    () => import('@/pages/AnnouncementsListPage'),
);
const NewsCategoryPage = lazy(() => import('@/pages/NewsCategoryPage'));
const NewsDetailPage = lazy(() => import('@/pages/NewsDetailPage'));
const AnnouncementDetailPage = lazy(
    () => import('@/pages/AnnouncementDetailPage'),
);
const EventsListPage = lazy(() => import('@/pages/EventsListPage'));
const EventDetailPage = lazy(() => import('@/pages/EventDetailPage'));
const PageDetailPage = lazy(() => import('@/pages/PageDetailPage'));
const FacultiesListPage = lazy(() => import('@/pages/FacultiesListPage'));
const FacultyDetailPage = lazy(() => import('@/pages/FacultyDetailPage'));
const StudyProgramDetailPage = lazy(
    () => import('@/pages/StudyProgramDetailPage'),
);
const DosenListPage = lazy(() => import('@/pages/DosenListPage'));
const DosenDetailPage = lazy(() => import('@/pages/DosenDetailPage'));
const CareersListPage = lazy(() => import('@/pages/CareersListPage'));
const CareerDetailPage = lazy(() => import('@/pages/CareerDetailPage'));
const FaqPage = lazy(() => import('@/pages/FaqPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const AchievementsPage = lazy(() => import('@/pages/AchievementsPage'));
const AchievementDetailPage = lazy(
    () => import('@/pages/AchievementDetailPage'),
);
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const TestimonialsPage = lazy(() => import('@/pages/TestimonialsPage'));
const TestimonialDetailPage = lazy(
    () => import('@/pages/TestimonialDetailPage'),
);
const PartnersPage = lazy(() => import('@/pages/PartnersPage'));
const AllPartnersPage = lazy(() => import('@/pages/AllPartnersPage'));
const PartnerDetailPage = lazy(() => import('@/pages/PartnerDetailPage'));
const InfoGrafisPage = lazy(() => import('@/pages/InfoGrafisPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function LocaleGuard() {
    const { locale } = useParams<{ locale?: string }>();
    if (!locale || !['id', 'en', 'ar'].includes(locale)) {
        return <Navigate to="/id" replace />;
    }
    return <Outlet />;
}

function RedirectNewsCategoryLegacy() {
    const { locale, slug } = useParams<{ locale?: string; slug?: string }>();

    if (!locale || !slug) return <Navigate to="/id" replace />;

    return <Navigate to={`/${locale}/kategori/${slug}`} replace />;
}

function RedirectNewsDetailLegacy() {
    const { locale, slug } = useParams<{ locale?: string; slug?: string }>();

    if (!locale || !slug) return <Navigate to="/id" replace />;

    return <Navigate to={`/${locale}/${slug}`} replace />;
}

function RedirectAchievementDetailLegacy() {
    const { locale, id } = useParams<{ locale?: string; id?: string }>();

    if (!locale || !id) return <Navigate to="/id" replace />;

    return <Navigate to={`/${locale}/prestasi-mahasiswa/${id}`} replace />;
}

export default function App() {
    return (
        <Suspense fallback={<LoadingPage />}>
            <Routes>
                {/* Root redirects to default locale */}
                <Route path="/" element={<Navigate to="/id" replace />} />

                {/* All public pages are under /:locale/... like Laravel FE */}
                <Route path=":locale" element={<LocaleGuard />}>
                    <Route element={<Layout />}>
                        <Route index element={<HomePage />} />

                        {/* Berita (News) */}
                        <Route path="berita" element={<NewsListPage />} />
                        <Route
                            path="berita/kategori/:slug"
                            element={<RedirectNewsCategoryLegacy />}
                        />
                        <Route
                            path="kategori/:slug"
                            element={<NewsCategoryPage />}
                        />
                        <Route
                            path="berita/:slug"
                            element={<RedirectNewsDetailLegacy />}
                        />

                        {/* Pengumuman (Announcements) */}
                        <Route
                            path="pengumuman"
                            element={<AnnouncementsListPage />}
                        />
                        <Route
                            path="pengumuman/:slug"
                            element={<AnnouncementDetailPage />}
                        />

                        {/* Agenda (Events) */}
                        <Route
                            path="agenda-kegiatan"
                            element={<EventsListPage />}
                        />
                        <Route
                            path="agenda"
                            element={
                                <Navigate to="../agenda-kegiatan" replace />
                            }
                        />
                        <Route
                            path="agenda/:id"
                            element={<EventDetailPage />}
                        />

                        {/* Halaman (Pages) */}
                        <Route
                            path="halaman/:slug"
                            element={<PageDetailPage />}
                        />

                        {/* Fakultas (Faculties) */}
                        <Route
                            path="fakultas"
                            element={<FacultiesListPage />}
                        />
                        <Route
                            path="fakultas/:slug"
                            element={<FacultyDetailPage />}
                        />
                        <Route
                            path="prodi/:slug"
                            element={<StudyProgramDetailPage />}
                        />

                        {/* Dosen (Lecturers) */}
                        <Route path="dosen" element={<DosenListPage />} />
                        <Route path="dosen/:id" element={<DosenDetailPage />} />

                        {/* Karir (Careers) */}
                        <Route path="karir" element={<CareersListPage />} />
                        <Route
                            path="karir/:id"
                            element={<CareerDetailPage />}
                        />

                        {/* FAQ */}
                        <Route path="faq" element={<FaqPage />} />

                        {/* Kontak (Contact) */}
                        <Route path="hubungi-kami" element={<ContactPage />} />
                        <Route
                            path="kontak"
                            element={<Navigate to="../hubungi-kami" replace />}
                        />

                        {/* Prestasi (Achievements) */}
                        <Route
                            path="prestasi-mahasiswa"
                            element={<AchievementsPage />}
                        />
                        <Route
                            path="prestasi"
                            element={
                                <Navigate to="../prestasi-mahasiswa" replace />
                            }
                        />
                        <Route
                            path="prestasi-mahasiswa/:id"
                            element={<AchievementDetailPage />}
                        />
                        <Route
                            path="prestasi/:id"
                            element={<RedirectAchievementDetailLegacy />}
                        />

                        {/* Pencarian (Search) */}
                        <Route path="pencarian" element={<SearchPage />} />

                        {/* Testimoni (Testimonials) */}
                        <Route
                            path="testimoni"
                            element={<TestimonialsPage />}
                        />
                        <Route
                            path="testimoni/:id"
                            element={<TestimonialDetailPage />}
                        />

                        {/* Mitra (Partners) */}
                        <Route path="mitra" element={<PartnersPage />} />
                        <Route
                            path="mitra-semua"
                            element={<AllPartnersPage />}
                        />
                        <Route
                            path="mitra/:id"
                            element={<PartnerDetailPage />}
                        />

                        {/* Info Grafis (Infographics) */}
                        <Route
                            path="info-grafis"
                            element={<InfoGrafisPage />}
                        />

                        {/* News catch-all slug parity with Laravel */}
                        <Route path=":slug" element={<NewsDetailPage />} />

                        {/* 404 */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Route>
            </Routes>
        </Suspense>
    );
}
