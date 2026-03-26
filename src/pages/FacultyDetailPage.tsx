import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    BookOpen,
    User,
    Mail,
    Award,
    ExternalLink,
} from 'lucide-react';
import { fetchFacultyDetail } from '@/api/faculties';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';

function stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function localize(id?: string | null, en?: string | null, lang?: string) {
    if (lang === 'en' && en) return en;
    return id || '';
}

export default function FacultyDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const { lang, withLocale } = useLanguage();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['faculty-detail', slug],
        queryFn: () => fetchFacultyDetail(slug!),
        enabled: !!slug,
    });

    if (isLoading) return <Loading />;
    if (error || !data) return <ErrorState onRetry={() => refetch()} />;

    const { faculty, study_programs, dosen_profiles } = data;
    const name =
        lang === 'en'
            ? faculty.name_en
            : lang === 'ar'
              ? faculty.name_ar
              : faculty.name_id;
    const desc =
        lang === 'en'
            ? faculty.description_en
            : lang === 'ar'
              ? faculty.description_ar
              : faculty.description_id;
    const vision =
        lang === 'en'
            ? faculty.vision_en
            : lang === 'ar'
              ? faculty.vision_ar
              : faculty.vision_id;
    const mission =
        lang === 'en'
            ? faculty.mission_en
            : lang === 'ar'
              ? faculty.mission_ar
              : faculty.mission_id;

    const structuralOfficials = dosen_profiles
        .filter((dosen) => dosen.jabatan?.is_active)
        .sort((a, b) => {
            const aOrder = a.jabatan?.urutan ?? 999999;
            const bOrder = b.jabatan?.urutan ?? 999999;
            if (aOrder !== bOrder) return aOrder - bOrder;
            return a.full_name.localeCompare(b.full_name);
        });

    return (
        <div>
            {/* Hero Section */}
            <div className="relative">
                {faculty.image ? (
                    <div className="relative h-64 md:h-80">
                        <img
                            src={faculty.image}
                            alt={name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute right-0 bottom-0 left-0 p-6 md:p-8">
                            <div className="mx-auto max-w-7xl">
                                <h1 className="text-2xl font-bold text-white md:text-4xl">
                                    {name}
                                </h1>
                                {faculty.dean_name && (
                                    <p className="mt-2 text-sm text-white/80">
                                        {lang === 'en' ? 'Dean: ' : 'Dekan: '}
                                        {faculty.dean_name}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] py-12 md:py-16">
                        <div className="mx-auto max-w-7xl px-4">
                            <h1 className="text-2xl font-bold text-white md:text-4xl">
                                {name}
                            </h1>
                            {faculty.dean_name && (
                                <p className="mt-2 text-sm text-white/80">
                                    {lang === 'en' ? 'Dean: ' : 'Dekan: '}
                                    {faculty.dean_name}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="py-8 md:py-12">
                <div className="mx-auto max-w-7xl px-4">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <Link
                            to={withLocale('/fakultas')}
                            className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-[var(--brand-primary)] dark:text-gray-400 dark:hover:text-[var(--brand-primary)]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {lang === 'en'
                                ? 'Back to Faculties'
                                : 'Kembali ke Daftar Fakultas'}
                        </Link>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-12">
                        <div className="space-y-8 lg:col-span-8">
                            <section className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
                                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                    {lang === 'en'
                                        ? 'Faculty Profile'
                                        : 'Profil Fakultas'}
                                </h2>
                                {desc ? (
                                    <div
                                        className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 prose-a:text-[var(--brand-primary)]"
                                        dangerouslySetInnerHTML={{
                                            __html: desc,
                                        }}
                                    />
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {lang === 'en'
                                            ? 'Faculty profile is not available yet.'
                                            : 'Profil fakultas belum diisi.'}
                                    </p>
                                )}
                            </section>

                            {(vision || mission) && (
                                <section className="grid gap-6 md:grid-cols-2">
                                    <div className="rounded-xl border bg-white p-5 shadow-sm dark:bg-gray-800">
                                        <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
                                            {lang === 'en' ? 'Vision' : 'Visi'}
                                        </h3>
                                        <div
                                            className="prose prose-sm max-w-none dark:prose-invert"
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    vision ||
                                                    (lang === 'en'
                                                        ? '<p>Vision is not available yet.</p>'
                                                        : '<p>Visi belum diisi.</p>'),
                                            }}
                                        />
                                    </div>
                                    <div className="rounded-xl border bg-white p-5 shadow-sm dark:bg-gray-800">
                                        <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
                                            {lang === 'en' ? 'Mission' : 'Misi'}
                                        </h3>
                                        <div
                                            className="prose prose-sm max-w-none dark:prose-invert"
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    mission ||
                                                    (lang === 'en'
                                                        ? '<p>Mission is not available yet.</p>'
                                                        : '<p>Misi belum diisi.</p>'),
                                            }}
                                        />
                                    </div>
                                </section>
                            )}

                            {/* Study Programs Section */}
                            <section>
                                <h2 className="mb-6 text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
                                    <BookOpen className="mr-2 inline-block h-6 w-6 text-[var(--brand-primary)] dark:text-[var(--brand-primary)]" />
                                    {lang === 'en'
                                        ? 'Study Programs'
                                        : 'Daftar Program Studi'}
                                </h2>
                                {study_programs.length > 0 ? (
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                                        {study_programs.map((prodi) => {
                                            const prodiName =
                                                lang === 'en'
                                                    ? prodi.name_en
                                                    : lang === 'ar'
                                                      ? prodi.name_ar
                                                      : prodi.name_id;
                                            const prodiDesc =
                                                lang === 'en'
                                                    ? prodi.description_en
                                                    : lang === 'ar'
                                                      ? prodi.description_ar
                                                      : prodi.description_id;
                                            return (
                                                <Link
                                                    key={prodi.id}
                                                    to={withLocale(
                                                        `/prodi/${prodi.slug}`,
                                                    )}
                                                    className="group overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
                                                >
                                                    <div className="relative aspect-video overflow-hidden">
                                                        {prodi.image ? (
                                                            <img
                                                                src={
                                                                    prodi.image
                                                                }
                                                                alt={prodiName}
                                                                loading="lazy"
                                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--brand-secondary)] to-[var(--brand-secondary)]">
                                                                <BookOpen className="h-10 w-10 text-white/40" />
                                                            </div>
                                                        )}
                                                        {prodi.accreditation && (
                                                            <span className="absolute top-2 right-2 rounded-full bg-yellow-500 px-2.5 py-0.5 text-xs font-bold text-white">
                                                                {
                                                                    prodi.accreditation
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
                                                            {prodiName}
                                                        </h3>
                                                        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                            {prodi.degree_level && (
                                                                <span className="rounded bg-gray-100 px-2 py-0.5 font-medium dark:bg-gray-700">
                                                                    {
                                                                        prodi.degree_level
                                                                    }
                                                                </span>
                                                            )}
                                                            {prodi.dosen_profiles_count !==
                                                                undefined && (
                                                                <span className="flex items-center gap-1">
                                                                    <User className="h-3 w-3" />
                                                                    {
                                                                        prodi.dosen_profiles_count
                                                                    }{' '}
                                                                    {lang ===
                                                                    'en'
                                                                        ? 'Lecturers'
                                                                        : 'Dosen'}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {prodiDesc && (
                                                            <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
                                                                {(() => {
                                                                    const text =
                                                                        stripHtml(
                                                                            prodiDesc,
                                                                        );
                                                                    return text.length >
                                                                        100
                                                                        ? text.substring(
                                                                              0,
                                                                              100,
                                                                          ) +
                                                                              '...'
                                                                        : text;
                                                                })()}
                                                            </p>
                                                        )}
                                                        <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[var(--brand-primary)] dark:text-[var(--brand-primary)]">
                                                            {lang === 'en'
                                                                ? 'View Program Detail'
                                                                : 'Lihat Detail Prodi'}
                                                            <ExternalLink className="h-3 w-3" />
                                                        </span>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed p-6 text-sm text-gray-500 dark:text-gray-400">
                                        {lang === 'en'
                                            ? 'No active study programs yet.'
                                            : 'Belum ada program studi aktif.'}
                                    </div>
                                )}
                            </section>
                        </div>

                        <aside className="space-y-6 lg:col-span-4">
                            <section className="rounded-xl border bg-white p-5 shadow-sm dark:bg-gray-800">
                                <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
                                    {lang === 'en'
                                        ? 'Structural Officers'
                                        : 'Pejabat Struktural'}
                                </h3>
                                {structuralOfficials.length > 0 ? (
                                    <ul className="space-y-3">
                                        {structuralOfficials.map((dosen) => (
                                            <li
                                                key={dosen.id}
                                                className="rounded-lg border bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/40"
                                            >
                                                <p className="text-xs font-semibold tracking-wide text-[var(--brand-primary)] uppercase dark:text-[var(--brand-primary)]">
                                                    {
                                                        dosen.jabatan
                                                            ?.nama_jabatan
                                                    }
                                                </p>
                                                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                                                    {dosen.full_name}
                                                </p>
                                                {dosen.study_program && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {localize(
                                                            dosen.study_program
                                                                .name_id,
                                                            dosen.study_program
                                                                .name_en,
                                                            lang,
                                                        )}
                                                    </p>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {lang === 'en'
                                            ? 'Structural officers data is not available yet.'
                                            : 'Data pejabat struktural belum tersedia.'}
                                    </p>
                                )}
                            </section>
                        </aside>
                    </div>

                    {/* Dosen Profiles Section */}
                    {dosen_profiles.length > 0 && (
                        <section className="mt-12">
                            <h2 className="mb-6 text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
                                <User className="mr-2 inline-block h-6 w-6 text-[var(--brand-primary)] dark:text-[var(--brand-primary)]" />
                                {lang === 'en' ? 'Lecturers' : 'Dosen'}
                            </h2>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {dosen_profiles.map((dosen) => {
                                    const expertise =
                                        lang === 'en'
                                            ? dosen.expertise_en
                                            : lang === 'ar'
                                              ? dosen.expertise_ar
                                              : dosen.expertise_id;
                                    return (
                                        <div
                                            key={dosen.id}
                                            className="overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800"
                                        >
                                            <div className="relative aspect-square overflow-hidden">
                                                {dosen.photo ? (
                                                    <img
                                                        src={dosen.photo}
                                                        alt={dosen.full_name}
                                                        loading="lazy"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700">
                                                        <User className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                                                    {dosen.full_name}
                                                </h3>
                                                {dosen.jabatan
                                                    ?.nama_jabatan && (
                                                    <p className="mb-1 text-xs font-medium text-[var(--brand-primary)] dark:text-[var(--brand-primary)]">
                                                        {
                                                            dosen.jabatan
                                                                .nama_jabatan
                                                        }
                                                    </p>
                                                )}
                                                {dosen.nidn && (
                                                    <p className="mb-1 text-xs text-gray-400">
                                                        NIDN: {dosen.nidn}
                                                    </p>
                                                )}
                                                {dosen.study_program && (
                                                    <p className="mb-2 text-xs text-[var(--brand-primary)] dark:text-[var(--brand-primary)]">
                                                        {lang === 'en'
                                                            ? dosen
                                                                  .study_program
                                                                  .name_en ||
                                                              dosen
                                                                  .study_program
                                                                  .name_id
                                                            : dosen
                                                                  .study_program
                                                                  .name_id}
                                                    </p>
                                                )}
                                                {expertise && (
                                                    <div className="mb-2">
                                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                            {lang === 'en'
                                                                ? 'Expertise:'
                                                                : 'Keahlian:'}
                                                        </p>
                                                        <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-300">
                                                            {expertise}
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    {dosen.email && (
                                                        <a
                                                            href={`mailto:${dosen.email}`}
                                                            className="rounded-full bg-gray-100 p-1.5 text-gray-500 transition-colors hover:bg-[var(--brand-primary)] hover:text-white dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-[var(--brand-secondary)] dark:hover:text-white"
                                                            title={dosen.email}
                                                        >
                                                            <Mail className="h-3.5 w-3.5" />
                                                        </a>
                                                    )}
                                                    {dosen.scholar_url && (
                                                        <a
                                                            href={
                                                                dosen.scholar_url
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="rounded-full bg-gray-100 p-1.5 text-gray-500 transition-colors hover:bg-[var(--brand-primary)] hover:text-white dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-[var(--brand-secondary)] dark:hover:text-white"
                                                            title="Google Scholar"
                                                        >
                                                            <Award className="h-3.5 w-3.5" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
