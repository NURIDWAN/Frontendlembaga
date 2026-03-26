import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Award,
    BookOpen,
    ExternalLink,
} from 'lucide-react';
import { fetchDosenDetail } from '@/api/dosen';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';

export default function DosenDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { lang, withLocale } = useLanguage();

    const {
        data: dosen,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['dosen-detail', id],
        queryFn: () => fetchDosenDetail(Number(id)),
        enabled: !!id,
    });

    if (isLoading) return <Loading />;
    if (error || !dosen) return <ErrorState onRetry={() => refetch()} />;

    const bio =
        lang === 'en'
            ? dosen.bio_en
            : lang === 'ar'
              ? dosen.bio_ar
              : dosen.bio_id;
    const expertise =
        lang === 'en'
            ? dosen.expertise_en
            : lang === 'ar'
              ? dosen.expertise_ar
              : dosen.expertise_id;
    const studyProgramName = dosen.study_program
        ? lang === 'en'
            ? dosen.study_program.name_en || dosen.study_program.name_id
            : dosen.study_program.name_id
        : null;

    return (
        <div>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] py-12 md:py-16">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                        {/* Photo */}
                        <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-full border-4 border-white/30 shadow-lg md:h-40 md:w-40">
                            {dosen.photo ? (
                                <img
                                    src={dosen.photo}
                                    alt={dosen.full_name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-white/20">
                                    <User className="h-16 w-16 text-white/60" />
                                </div>
                            )}
                        </div>
                        {/* Info */}
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl font-bold text-white md:text-3xl">
                                {dosen.full_name}
                            </h1>
                            {dosen.nidn && (
                                <p className="mt-1 text-sm text-white/80">
                                    NIDN: {dosen.nidn}
                                </p>
                            )}
                            {studyProgramName && (
                                <p className="mt-1 flex items-center justify-center gap-1 text-sm text-white/90 md:justify-start">
                                    <BookOpen className="h-4 w-4" />
                                    {studyProgramName}
                                </p>
                            )}
                            {/* Contact links */}
                            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                                {dosen.email && (
                                    <a
                                        href={`mailto:${dosen.email}`}
                                        className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/30"
                                    >
                                        <Mail className="h-4 w-4" />
                                        {dosen.email}
                                    </a>
                                )}
                                {dosen.phone && (
                                    <a
                                        href={`tel:${dosen.phone}`}
                                        className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/30"
                                    >
                                        <Phone className="h-4 w-4" />
                                        {dosen.phone}
                                    </a>
                                )}
                                {dosen.scholar_url && (
                                    <a
                                        href={dosen.scholar_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/30"
                                    >
                                        <Award className="h-4 w-4" />
                                        Google Scholar
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-8 md:py-12">
                <div className="mx-auto max-w-7xl px-4">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <Link
                            to={withLocale('/dosen')}
                            className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-[var(--brand-primary)] dark:text-gray-400 dark:hover:text-[var(--brand-primary)]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {lang === 'id'
                                ? 'Kembali ke Daftar Dosen'
                                : lang === 'en'
                                  ? 'Back to Lecturers'
                                  : 'العودة إلى المحاضرين'}
                        </Link>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* Bio */}
                            {bio && (
                                <section>
                                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                        {lang === 'id'
                                            ? 'Biografi'
                                            : lang === 'en'
                                              ? 'Biography'
                                              : 'السيرة الذاتية'}
                                    </h2>
                                    <div
                                        className="prose max-w-none text-gray-700 dark:text-gray-300 dark:prose-invert prose-headings:text-gray-900 prose-a:text-[var(--brand-primary)]"
                                        dangerouslySetInnerHTML={{
                                            __html: bio,
                                        }}
                                    />
                                </section>
                            )}

                            {/* Expertise */}
                            {expertise && (
                                <section>
                                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                        {lang === 'id'
                                            ? 'Bidang Keahlian'
                                            : lang === 'en'
                                              ? 'Area of Expertise'
                                              : 'مجال الخبرة'}
                                    </h2>
                                    <div
                                        className="prose max-w-none text-gray-700 dark:text-gray-300 dark:prose-invert prose-headings:text-gray-900 prose-a:text-[var(--brand-primary)]"
                                        dangerouslySetInnerHTML={{
                                            __html: expertise,
                                        }}
                                    />
                                </section>
                            )}

                            {/* Publications */}
                            {!!dosen.publications && (
                                <section>
                                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                        {lang === 'id'
                                            ? 'Publikasi'
                                            : lang === 'en'
                                              ? 'Publications'
                                              : 'المنشورات'}
                                    </h2>
                                    <div
                                        className="prose max-w-none text-gray-700 dark:text-gray-300 dark:prose-invert prose-headings:text-gray-900 prose-a:text-[var(--brand-primary)]"
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                typeof dosen.publications ===
                                                'string'
                                                    ? dosen.publications
                                                    : '',
                                        }}
                                    />
                                </section>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800">
                                <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                    {lang === 'id'
                                        ? 'Informasi'
                                        : lang === 'en'
                                          ? 'Information'
                                          : 'معلومات'}
                                </h3>
                                <dl className="space-y-3 text-sm">
                                    {dosen.nidn && (
                                        <div>
                                            <dt className="font-medium text-gray-600 dark:text-gray-400">
                                                NIDN
                                            </dt>
                                            <dd className="text-gray-900 dark:text-white">
                                                {dosen.nidn}
                                            </dd>
                                        </div>
                                    )}
                                    {studyProgramName && (
                                        <div>
                                            <dt className="font-medium text-gray-600 dark:text-gray-400">
                                                {lang === 'id'
                                                    ? 'Program Studi'
                                                    : 'Study Program'}
                                            </dt>
                                            <dd className="text-gray-900 dark:text-white">
                                                {studyProgramName}
                                            </dd>
                                        </div>
                                    )}
                                    {dosen.email && (
                                        <div>
                                            <dt className="font-medium text-gray-600 dark:text-gray-400">
                                                Email
                                            </dt>
                                            <dd>
                                                <a
                                                    href={`mailto:${dosen.email}`}
                                                    className="text-[var(--brand-primary)] hover:underline dark:text-[var(--brand-primary)]"
                                                >
                                                    {dosen.email}
                                                </a>
                                            </dd>
                                        </div>
                                    )}
                                    {dosen.phone && (
                                        <div>
                                            <dt className="font-medium text-gray-600 dark:text-gray-400">
                                                {lang === 'id'
                                                    ? 'Telepon'
                                                    : 'Phone'}
                                            </dt>
                                            <dd>
                                                <a
                                                    href={`tel:${dosen.phone}`}
                                                    className="text-[var(--brand-primary)] hover:underline dark:text-[var(--brand-primary)]"
                                                >
                                                    {dosen.phone}
                                                </a>
                                            </dd>
                                        </div>
                                    )}
                                    {dosen.scholar_url && (
                                        <div>
                                            <dt className="font-medium text-gray-600 dark:text-gray-400">
                                                Google Scholar
                                            </dt>
                                            <dd>
                                                <a
                                                    href={dosen.scholar_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-[var(--brand-primary)] hover:underline dark:text-[var(--brand-primary)]"
                                                >
                                                    {lang === 'id'
                                                        ? 'Lihat Profil'
                                                        : 'View Profile'}
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
