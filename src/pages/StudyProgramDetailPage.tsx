import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    BookOpen,
    Building2,
    ExternalLink,
    Mail,
    Phone,
    User,
} from 'lucide-react';
import { fetchStudyProgramDetail } from '@/api/faculties';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';

function localize(id?: string | null, en?: string | null, lang?: string) {
    if (lang === 'en' && en) return en;
    return id || '';
}

export default function StudyProgramDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const { lang, withLocale } = useLanguage();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['study-program-detail', slug],
        queryFn: () => fetchStudyProgramDetail(slug!),
        enabled: !!slug,
    });

    if (isLoading) return <Loading />;
    if (error || !data) return <ErrorState onRetry={() => refetch()} />;

    const { study_program, faculty, dosen_profiles, related_programs } = data;
    const programName = localize(
        study_program.name_id,
        study_program.name_en,
        lang,
    );
    const facultyName = faculty
        ? localize(faculty.name_id, faculty.name_en, lang)
        : null;

    const description = localize(
        study_program.description_id,
        study_program.description_en,
        lang,
    );
    const vision = localize(
        study_program.vision_id,
        study_program.vision_en,
        lang,
    );
    const mission = localize(
        study_program.mission_id,
        study_program.mission_en,
        lang,
    );

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
            <div className="relative">
                {study_program.image ? (
                    <div className="relative h-64 md:h-80">
                        <img
                            src={study_program.image}
                            alt={programName}
                            loading="lazy"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute right-0 bottom-0 left-0 p-6 md:p-8">
                            <div className="mx-auto max-w-7xl">
                                <h1 className="text-2xl font-bold text-white md:text-4xl">
                                    {programName}
                                </h1>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] py-12 md:py-16">
                        <div className="mx-auto max-w-7xl px-4">
                            <h1 className="text-2xl font-bold text-white md:text-4xl">
                                {programName}
                            </h1>
                        </div>
                    </div>
                )}
            </div>

            <div className="py-8 md:py-12">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mb-6 flex flex-wrap items-center gap-3">
                        {faculty?.slug && (
                            <Link
                                to={withLocale(`/fakultas/${faculty.slug}`)}
                                className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-[var(--brand-primary)] dark:text-gray-400 dark:hover:text-[var(--brand-primary)]"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                {lang === 'en'
                                    ? 'Back to Faculty'
                                    : 'Kembali ke Fakultas'}
                            </Link>
                        )}
                        <Link
                            to={withLocale('/fakultas')}
                            className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-[var(--brand-primary)] dark:text-gray-400 dark:hover:text-[var(--brand-primary)]"
                        >
                            <Building2 className="h-4 w-4" />
                            {lang === 'en' ? 'Faculties' : 'Daftar Fakultas'}
                        </Link>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-12">
                        <div className="space-y-8 lg:col-span-8">
                            <section className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
                                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                    {lang === 'en'
                                        ? 'Study Program Profile'
                                        : 'Profil Program Studi'}
                                </h2>
                                {description ? (
                                    <div
                                        className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 prose-a:text-[var(--brand-primary)]"
                                        dangerouslySetInnerHTML={{
                                            __html: description,
                                        }}
                                    />
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {lang === 'en'
                                            ? 'Study program profile is not available yet.'
                                            : 'Profil program studi belum diisi.'}
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
                                                        ? '<p>Not available yet.</p>'
                                                        : '<p>Belum diisi.</p>'),
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
                                                        ? '<p>Not available yet.</p>'
                                                        : '<p>Belum diisi.</p>'),
                                            }}
                                        />
                                    </div>
                                </section>
                            )}

                            <section>
                                <h2 className="mb-6 text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
                                    <User className="mr-2 inline-block h-6 w-6 text-[var(--brand-primary)] dark:text-[var(--brand-primary)]" />
                                    {lang === 'en'
                                        ? 'Program Lecturers'
                                        : 'Dosen Program Studi'}
                                </h2>

                                {dosen_profiles.length > 0 ? (
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {dosen_profiles.map((dosen) => (
                                            <div
                                                key={dosen.id}
                                                className="overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800"
                                            >
                                                <div className="relative aspect-square overflow-hidden">
                                                    {dosen.photo ? (
                                                        <img
                                                            src={dosen.photo}
                                                            alt={
                                                                dosen.full_name
                                                            }
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
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {dosen.full_name}
                                                    </p>
                                                    {dosen.jabatan
                                                        ?.nama_jabatan && (
                                                        <p className="mt-1 text-xs text-[var(--brand-primary)] dark:text-[var(--brand-primary)]">
                                                            {
                                                                dosen.jabatan
                                                                    .nama_jabatan
                                                            }
                                                        </p>
                                                    )}
                                                    <div className="mt-3 flex items-center gap-2">
                                                        {dosen.email && (
                                                            <a
                                                                href={`mailto:${dosen.email}`}
                                                                className="rounded-full bg-gray-100 p-1.5 text-gray-500 transition-colors hover:bg-[var(--brand-primary)] hover:text-white dark:bg-gray-700"
                                                            >
                                                                <Mail className="h-3.5 w-3.5" />
                                                            </a>
                                                        )}
                                                        {dosen.phone && (
                                                            <a
                                                                href={`tel:${dosen.phone.replace(/[^\d+]/g, '')}`}
                                                                className="rounded-full bg-gray-100 p-1.5 text-gray-500 transition-colors hover:bg-[var(--brand-primary)] hover:text-white dark:bg-gray-700"
                                                            >
                                                                <Phone className="h-3.5 w-3.5" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed p-6 text-sm text-gray-500 dark:text-gray-400">
                                        {lang === 'en'
                                            ? 'No active lecturers in this study program yet.'
                                            : 'Belum ada dosen aktif pada program studi ini.'}
                                    </div>
                                )}
                            </section>
                        </div>

                        <aside className="space-y-6 lg:col-span-4">
                            <section className="rounded-xl border bg-white p-5 shadow-sm dark:bg-gray-800">
                                <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
                                    {lang === 'en'
                                        ? 'Program Summary'
                                        : 'Ringkasan Program'}
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                    {facultyName && (
                                        <li>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {lang === 'en'
                                                    ? 'Faculty: '
                                                    : 'Fakultas: '}
                                            </span>
                                            {facultyName}
                                        </li>
                                    )}
                                    {study_program.degree_level && (
                                        <li>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {lang === 'en'
                                                    ? 'Degree: '
                                                    : 'Jenjang: '}
                                            </span>
                                            {study_program.degree_level}
                                        </li>
                                    )}
                                    {study_program.accreditation && (
                                        <li>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {lang === 'en'
                                                    ? 'Accreditation: '
                                                    : 'Akreditasi: '}
                                            </span>
                                            {study_program.accreditation}
                                        </li>
                                    )}
                                </ul>
                            </section>

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

                            {related_programs.length > 0 && (
                                <section className="rounded-xl border bg-white p-5 shadow-sm dark:bg-gray-800">
                                    <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
                                        {lang === 'en'
                                            ? 'Related Study Programs'
                                            : 'Program Studi Terkait'}
                                    </h3>
                                    <ul className="space-y-2">
                                        {related_programs
                                            .slice(0, 8)
                                            .map((program) => (
                                                <li key={program.id}>
                                                    <Link
                                                        to={withLocale(
                                                            `/prodi/${program.slug}`,
                                                        )}
                                                        className="inline-flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-[var(--brand-primary)] dark:text-gray-300 dark:hover:text-[var(--brand-primary)]"
                                                    >
                                                        <BookOpen className="h-3.5 w-3.5" />
                                                        {localize(
                                                            program.name_id,
                                                            program.name_en,
                                                            lang,
                                                        )}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </Link>
                                                </li>
                                            ))}
                                    </ul>
                                </section>
                            )}
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
}
