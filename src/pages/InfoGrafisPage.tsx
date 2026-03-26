import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    Newspaper,
    CalendarDays,
    FileText,
    Handshake,
    MessageSquare,
    BarChart3,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { fetchInfoGrafis, type InfoGrafisStats } from '@/api/infografis';
import { useLanguage } from '@/context/LanguageContext';
import { useInstitution } from '@/context/InstitutionContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';

const statCards = [
    {
        key: 'total_news' as keyof InfoGrafisStats,
        labelId: 'Berita',
        labelEn: 'News Articles',
        labelAr: 'الأخبار',
        icon: Newspaper,
        color: 'bg-blue-500',
        bgLight: 'bg-blue-50',
        darkBgLight: 'dark:bg-blue-950/30',
    },
    {
        key: 'total_events' as keyof InfoGrafisStats,
        labelId: 'Agenda Kegiatan',
        labelEn: 'Events',
        labelAr: 'الفعاليات',
        icon: CalendarDays,
        color: 'bg-[var(--brand-primary)]',
        bgLight: 'bg-[var(--brand-primary)]/10',
        darkBgLight: 'dark:bg-[var(--brand-primary)]/30',
    },
    {
        key: 'total_pages' as keyof InfoGrafisStats,
        labelId: 'Halaman',
        labelEn: 'Pages',
        labelAr: 'الصفحات',
        icon: FileText,
        color: 'bg-purple-500',
        bgLight: 'bg-purple-50',
        darkBgLight: 'dark:bg-purple-950/30',
    },
    {
        key: 'total_partners' as keyof InfoGrafisStats,
        labelId: 'Mitra Kerjasama',
        labelEn: 'Partners',
        labelAr: 'الشركاء',
        icon: Handshake,
        color: 'bg-orange-500',
        bgLight: 'bg-orange-50',
        darkBgLight: 'dark:bg-orange-950/30',
    },
    {
        key: 'total_testimonials' as keyof InfoGrafisStats,
        labelId: 'Testimoni',
        labelEn: 'Testimonials',
        labelAr: 'الشهادات',
        icon: MessageSquare,
        color: 'bg-pink-500',
        bgLight: 'bg-pink-50',
        darkBgLight: 'dark:bg-pink-950/30',
    },
];

const PIE_COLORS = ['#3B82F6', '#22C55E', '#A855F7', '#F97316', '#EC4899'];

const localizedLabels = {
    id: {
        title: 'Info Grafis',
        home: 'Beranda',
        subtitle: (name: string) => `Statistik dan data ${name}`,
        summaryTitle: 'Ringkasan data dan statistik',
        newsChart: 'Tren Publikasi Berita (12 Bulan)',
        eventsChart: 'Tren Agenda Kegiatan (12 Bulan)',
        distributionChart: 'Distribusi Konten',
        articles: 'Artikel',
        events: 'Kegiatan',
        note: 'Data diperbarui secara real-time berdasarkan konten yang dipublikasikan.',
    },
    en: {
        title: 'Infographics',
        home: 'Home',
        subtitle: (name: string) => `Statistics and data for ${name}`,
        summaryTitle: 'Data and statistics summary',
        newsChart: 'News Publication Trend (12 Months)',
        eventsChart: 'Events Trend (12 Months)',
        distributionChart: 'Content Distribution',
        articles: 'Articles',
        events: 'Events',
        note: 'Data is updated in real-time based on published content.',
    },
    ar: {
        title: 'الرسوم البيانية',
        home: 'الرئيسية',
        subtitle: (name: string) => `الإحصائيات والبيانات لـ ${name}`,
        summaryTitle: 'ملخص البيانات والإحصائيات',
        newsChart: 'اتجاه نشر الأخبار (12 شهرًا)',
        eventsChart: 'اتجاه الفعاليات (12 شهرًا)',
        distributionChart: 'توزيع المحتوى',
        articles: 'المقالات',
        events: 'الفعاليات',
        note: 'يتم تحديث البيانات في الوقت الفعلي بناءً على المحتوى المنشور.',
    },
} as const;

const distributionLabelMap: Record<string, Record<string, string>> = {
    News: { id: 'Berita', en: 'News', ar: 'الأخبار' },
    Events: { id: 'Kegiatan', en: 'Events', ar: 'الفعاليات' },
    Pages: { id: 'Halaman', en: 'Pages', ar: 'الصفحات' },
    Partners: { id: 'Mitra', en: 'Partners', ar: 'الشركاء' },
    Testimonials: { id: 'Testimoni', en: 'Testimonials', ar: 'الشهادات' },
};

export default function InfoGrafisPage() {
    const { lang, withLocale } = useLanguage();
    const { institution } = useInstitution();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['info-grafis'],
        queryFn: fetchInfoGrafis,
    });

    if (isLoading) return <Loading />;
    if (error || !data) return <ErrorState onRetry={() => refetch()} />;

    const t =
        lang in localizedLabels
            ? localizedLabels[lang as keyof typeof localizedLabels]
            : localizedLabels.id;

    const { stats, monthlyNews, monthlyEvents, contentDistribution } = data;

    const localizedDistribution = contentDistribution.map((item) => ({
        ...item,
        name: distributionLabelMap[item.name]?.[lang] ?? item.name,
    }));

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
                        {t.home}
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                        {t.title}
                    </h1>
                    <div className="mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {t.subtitle(institution?.name ?? '')}
                    </p>
                </div>

                {/* Institution Header Card */}
                <div className="mb-8 rounded-xl bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] p-8 text-white">
                    <div className="flex items-center gap-4">
                        <BarChart3 className="h-12 w-12 text-white/80" />
                        <div>
                            <h2 className="text-xl font-bold">
                                {institution?.name}
                            </h2>
                            <p className="text-sm text-white/80">
                                {t.summaryTitle}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {statCards.map((card) => {
                        const Icon = card.icon;
                        const label =
                            lang === 'ar'
                                ? card.labelAr
                                : lang === 'en'
                                  ? card.labelEn
                                  : card.labelId;
                        return (
                            <div
                                key={card.key}
                                className={`rounded-xl ${card.bgLight} ${card.darkBgLight} p-6 shadow-md`}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`flex h-14 w-14 items-center justify-center rounded-xl ${card.color} text-white shadow-lg`}
                                    >
                                        <Icon className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {stats[card.key].toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {label}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Charts Section */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Monthly News Bar Chart */}
                    <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                            {t.newsChart}
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyNews}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#E5E7EB"
                                />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 11 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip />
                                <Bar
                                    dataKey="count"
                                    name={t.articles}
                                    fill="#3B82F6"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Monthly Events Line Chart */}
                    <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                            {t.eventsChart}
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyEvents}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#E5E7EB"
                                />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 11 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    name={t.events}
                                    stroke="#22C55E"
                                    strokeWidth={2}
                                    dot={{ fill: '#22C55E', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Content Distribution Pie Chart */}
                    <div className="rounded-xl bg-white p-6 shadow-md lg:col-span-2 dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                            {t.distributionChart}
                        </h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={localizedDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    label={({ name, percent }) =>
                                        `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                                    }
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {localizedDistribution.map(
                                        (_entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    PIE_COLORS[
                                                        index %
                                                            PIE_COLORS.length
                                                    ]
                                                }
                                            />
                                        ),
                                    )}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Note */}
                <div className="mt-8 rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {t.note}
                </div>
            </div>
        </div>
    );
}
