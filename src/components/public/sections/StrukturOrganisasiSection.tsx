interface Dosen {
    id: number;
    name: string;
    title_prefix?: string | null;
    title_suffix?: string | null;
    email?: string | null;
    phone?: string | null;
}

interface Item {
    title_id?: string;
    title_en?: string;
    title_ar?: string;
}

interface Props {
    data: {
        items?: Item[];
    };
    lecturers?: Record<string, Dosen[]>;
    locale: string;
}

const LABELS: Record<string, Record<string, string>> = {
    id: {
        no: 'No',
        jabatan: 'Jabatan',
        nama_dosen: 'Nama Dosen',
        email: 'Email',
        telepon: 'Telepon',
        jabatan_count: 'jabatan',
        dosen_aktif: 'dosen aktif',
    },
    en: {
        no: 'No',
        jabatan: 'Position',
        nama_dosen: 'Lecturer Name',
        email: 'Email',
        telepon: 'Phone',
        jabatan_count: 'positions',
        dosen_aktif: 'active lecturers',
    },
    ar: {
        no: 'رقم',
        jabatan: 'المنصب',
        nama_dosen: 'اسم المحاضر',
        email: 'البريد الإلكتروني',
        telepon: 'الهاتف',
        jabatan_count: 'مناصب',
        dosen_aktif: 'محاضرين نشطين',
    },
};

interface TableRow {
    jabatan: string;
    jabatanCount: number;
    isFirstInJabatan: boolean;
    dosen: Dosen;
}

export default function StrukturOrganisasiSection({
    data,
    lecturers,
    locale,
}: Props) {
    const sectionTitle = data.items?.[0];

    const title =
        locale === 'en'
            ? sectionTitle?.title_en || 'Organizational Structure'
            : locale === 'ar'
              ? sectionTitle?.title_ar || 'الهيكل التنظيمي'
              : sectionTitle?.title_id || 'Struktur Organisasi';

    const groupedEntries = Object.entries(lecturers || {}).filter(
        ([, items]) => items.length > 0,
    );

    const rows: TableRow[] = groupedEntries.flatMap(([jabatan, items]) =>
        items.map((dosen, index) => ({
            jabatan,
            jabatanCount: items.length,
            isFirstInJabatan: index === 0,
            dosen,
        })),
    );

    if (rows.length === 0) return null;

    const totalLecturers = rows.length;
    const totalJabatan = groupedEntries.length;

    const t = LABELS[locale] || LABELS.id;

    const formatName = (dosen: Dosen): string => {
        const prefix = dosen.title_prefix ? `${dosen.title_prefix} ` : '';
        const suffix = dosen.title_suffix ? `, ${dosen.title_suffix}` : '';
        return `${prefix}${dosen.name}${suffix}`;
    };

    const toTelHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

    return (
        <section
            className="bg-gray-50 py-12 md:py-16"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
            <div className="mx-auto max-w-7xl px-4">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                        {title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        {totalJabatan} {t.jabatan_count} • {totalLecturers} {t.dosen_aktif}
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="hidden overflow-x-auto md:block">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-100 text-xs font-semibold text-gray-500 uppercase">
                                <tr>
                                    <th className="px-4 py-3">{t.no}</th>
                                    <th className="px-4 py-3">{t.jabatan}</th>
                                    <th className="px-4 py-3">{t.nama_dosen}</th>
                                    <th className="px-4 py-3">{t.email}</th>
                                    <th className="px-4 py-3">{t.telepon}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {rows.map((row, index) => (
                                    <tr
                                        key={`${row.jabatan}-${row.dosen.id}`}
                                        className="odd:bg-white even:bg-gray-50 hover:bg-[var(--brand-primary)]/5"
                                    >
                                        <td className="px-4 py-3 align-top text-gray-500">
                                            {index + 1}
                                        </td>
                                        {row.isFirstInJabatan && (
                                            <td
                                                rowSpan={row.jabatanCount}
                                                className="px-4 py-3 align-top font-semibold text-gray-900"
                                            >
                                                {row.jabatan}
                                            </td>
                                        )}
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {formatName(row.dosen)}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {row.dosen.email ? (
                                                <a
                                                    href={`mailto:${row.dosen.email}`}
                                                    className="hover:text-[var(--brand-primary)] hover:underline"
                                                >
                                                    {row.dosen.email}
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {row.dosen.phone ? (
                                                <a
                                                    href={toTelHref(
                                                        row.dosen.phone,
                                                    )}
                                                    className="hover:text-[var(--brand-primary)] hover:underline"
                                                >
                                                    {row.dosen.phone}
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="space-y-5 p-4 md:hidden">
                        {groupedEntries.map(([jabatan, items], groupIndex) => (
                            <div key={jabatan} className="space-y-3">
                                <div className="rounded-lg bg-[var(--brand-primary)]/10 px-3 py-2 text-sm font-semibold text-[var(--brand-primary)]">
                                    {groupIndex + 1}. {jabatan}
                                </div>
                                <div className="space-y-3">
                                    {items.map((dosen, index) => (
                                        <div
                                            key={dosen.id}
                                            className="rounded-lg border border-gray-200 bg-white p-3"
                                        >
                                            <p className="text-sm font-medium text-gray-900">
                                                {index + 1}. {formatName(dosen)}
                                            </p>
                                            <div className="mt-1 space-y-1 text-xs text-gray-600">
                                                <p>
                                                    {t.email}:{' '}
                                                    {dosen.email ? (
                                                        <a
                                                            href={`mailto:${dosen.email}`}
                                                            className="hover:text-[var(--brand-primary)] hover:underline"
                                                        >
                                                            {dosen.email}
                                                        </a>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </p>
                                                <p>
                                                    {t.telepon}:{' '}
                                                    {dosen.phone ? (
                                                        <a
                                                            href={toTelHref(
                                                                dosen.phone,
                                                            )}
                                                            className="hover:text-[var(--brand-primary)] hover:underline"
                                                        >
                                                            {dosen.phone}
                                                        </a>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
