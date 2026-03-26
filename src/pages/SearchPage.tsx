import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import {
    Search,
    Calendar,
    Eye,
    MapPin,
    Clock,
    FileText,
    Newspaper,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import {
    createElement,
    useState,
    useMemo,
    type ReactNode,
    type FormEvent,
} from 'react';
import { fetchSearch } from '@/api/search';
import { useLanguage } from '@/context/LanguageContext';
import { useInstitution } from '@/context/InstitutionContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';
import type {
    SearchResultItem,
    PaginatedSearchResult,
    SearchResults,
} from '@/types';

// ── Helpers ────────────────────────────────────────────────────

function formatDate(dateString: string, locale: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(
        locale === 'ar' ? 'ar-SA' : locale === 'id' ? 'id-ID' : 'en-US',
        { day: 'numeric', month: 'long', year: 'numeric' },
    );
}

/**
 * Highlight search query terms in text by wrapping matches in <mark> tags.
 */
function highlightTerms(text: string, query: string): ReactNode[] {
    if (!query.trim() || !text) return [text];

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
        regex.test(part) ? (
            <mark
                key={i}
                className="bg-transparent font-semibold text-gray-900 dark:text-white"
            >
                {part}
            </mark>
        ) : (
            <span key={i}>{part}</span>
        ),
    );
}

// ── Translations ───────────────────────────────────────────────

function t(locale: string, key: string): string {
    const translations: Record<string, Record<string, string>> = {
        search_placeholder: {
            id: 'Cari berita, halaman, agenda...',
            en: 'Search news, pages, events...',
            ar: 'ابحث في الأخبار والصفحات والأحداث...',
        },
        all: { id: 'Semua', en: 'All', ar: 'الكل' },
        news: { id: 'Berita', en: 'News', ar: 'الأخبار' },
        pages: { id: 'Halaman', en: 'Pages', ar: 'الصفحات' },
        events: { id: 'Agenda', en: 'Events', ar: 'الأحداث' },
        search: { id: 'Pencarian', en: 'Search', ar: 'بحث' },
        type_to_search: {
            id: 'Ketik kata kunci untuk mencari...',
            en: 'Type a keyword to search...',
            ar: 'اكتب كلمة للبحث...',
        },
        no_results: {
            id: 'Tidak ditemukan hasil untuk',
            en: 'No results found for',
            ar: 'لم يتم العثور على نتائج لـ',
        },
        try_different: {
            id: 'Coba gunakan kata kunci yang berbeda atau periksa ejaan Anda.',
            en: 'Try using different keywords or check your spelling.',
            ar: 'حاول استخدام كلمات مختلفة أو تحقق من الإملاء.',
        },
        results_count: {
            id: 'Ditemukan sekitar {total} hasil',
            en: 'About {total} results found',
            ar: 'تم العثور على حوالي {total} نتيجة',
        },
        prev: { id: 'Sebelumnya', en: 'Previous', ar: 'السابق' },
        next: { id: 'Berikutnya', en: 'Next', ar: 'التالي' },
        views: { id: 'dilihat', en: 'views', ar: 'مشاهدة' },
        min_chars: {
            id: 'Minimal 2 karakter untuk mencari.',
            en: 'Minimum 2 characters to search.',
            ar: 'الحد الأدنى حرفان للبحث.',
        },
    };
    return translations[key]?.[locale] || translations[key]?.['id'] || key;
}

// ── URL Breadcrumb Builder ─────────────────────────────────────

function buildBreadcrumb(
    item: SearchResultItem,
    locale: string,
    institutionName: string,
): string {
    const parts = [institutionName];
    switch (item.type) {
        case 'news':
            parts.push(
                locale === 'en'
                    ? 'News'
                    : locale === 'ar'
                      ? 'الأخبار'
                      : 'Berita',
            );
            if (item.category) parts.push(item.category.name);
            break;
        case 'page':
            parts.push(
                locale === 'en'
                    ? 'Pages'
                    : locale === 'ar'
                      ? 'الصفحات'
                      : 'Halaman',
            );
            break;
        case 'event':
            parts.push(
                locale === 'en'
                    ? 'Events'
                    : locale === 'ar'
                      ? 'الأحداث'
                      : 'Agenda',
            );
            break;
    }
    return parts.join(' › ');
}

function getItemUrl(item: SearchResultItem, locale: string): string {
    switch (item.type) {
        case 'news':
            return `/${locale}/berita/${item.slug}`;
        case 'page':
            return `/${locale}/halaman/${item.slug}`;
        case 'event':
            return `/${locale}/agenda/${item.id}`;
        default:
            return '#';
    }
}

function getTypeIcon(type: string) {
    switch (type) {
        case 'news':
            return Newspaper;
        case 'page':
            return FileText;
        case 'event':
            return CalendarDays;
        default:
            return Search;
    }
}

// ── Components ─────────────────────────────────────────────────

function ResultItem({
    item,
    locale,
    query,
    institutionName,
}: {
    item: SearchResultItem;
    locale: string;
    query: string;
    institutionName: string;
}) {
    const url = getItemUrl(item, locale);
    const breadcrumb = buildBreadcrumb(item, locale, institutionName);
    const TypeIcon = getTypeIcon(item.type);

    return (
        <div className="mb-7 max-w-[600px]">
            {/* Breadcrumb line */}
            <div className="mb-1 flex items-center gap-1.5 text-sm">
                {createElement(TypeIcon, {
                    className:
                        'h-3.5 w-3.5 flex-shrink-0 text-gray-400 dark:text-gray-500',
                })}
                <span className="truncate text-gray-500 dark:text-gray-400">
                    {breadcrumb}
                </span>
            </div>

            {/* Title as link */}
            <Link
                to={url}
                className="group mb-1 block text-xl leading-snug font-normal text-[var(--brand-primary)] decoration-[var(--brand-primary)] decoration-1 hover:underline dark:text-[var(--brand-primary)] dark:decoration-[var(--brand-primary)]"
            >
                {highlightTerms(item.title, query)}
            </Link>

            {/* Snippet */}
            {item.excerpt && (
                <p className="mb-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {highlightTerms(item.excerpt, query)}
                </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 dark:text-gray-500">
                {/* News metadata */}
                {item.type === 'news' && item.published_at && (
                    <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.published_at, locale)}
                    </span>
                )}
                {item.type === 'news' && item.views !== undefined && (
                    <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.views.toLocaleString()} {t(locale, 'views')}
                    </span>
                )}
                {item.type === 'news' && item.category && (
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                        {item.category.name}
                    </span>
                )}

                {/* Event metadata */}
                {item.type === 'event' && item.date_start && (
                    <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.date_start, locale)}
                    </span>
                )}
                {item.type === 'event' && item.time_start && (
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.time_start.slice(0, 5)} WIB
                    </span>
                )}
                {item.type === 'event' && item.location && (
                    <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {item.location}
                    </span>
                )}
            </div>
        </div>
    );
}

function SearchPagination({
    currentPage,
    lastPage,
    locale,
    onPageChange,
}: {
    currentPage: number;
    lastPage: number;
    locale: string;
    onPageChange: (page: number) => void;
}) {
    if (lastPage <= 1) return null;

    // Build page numbers: show at most 7 pages centered around current
    const pages: (number | 'ellipsis')[] = [];
    const delta = 3;
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(lastPage, currentPage + delta);

    if (left > 1) {
        pages.push(1);
        if (left > 2) pages.push('ellipsis');
    }
    for (let i = left; i <= right; i++) {
        pages.push(i);
    }
    if (right < lastPage) {
        if (right < lastPage - 1) pages.push('ellipsis');
        pages.push(lastPage);
    }

    return (
        <nav className="mt-10 flex items-center justify-center gap-1">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-700"
            >
                <ChevronLeft className="h-4 w-4" />
                {t(locale, 'prev')}
            </button>

            {pages.map((p, i) =>
                p === 'ellipsis' ? (
                    <span
                        key={`e-${i}`}
                        className="px-2 text-gray-400 dark:text-gray-500"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`min-w-[36px] rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            p === currentPage
                                ? 'bg-[var(--brand-primary)] text-white'
                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                    >
                        {p}
                    </button>
                ),
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= lastPage}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-700"
            >
                {t(locale, 'next')}
                <ChevronRight className="h-4 w-4" />
            </button>
        </nav>
    );
}

// ── Main Page ──────────────────────────────────────────────────

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const activeType = searchParams.get('type') || 'all';
    const currentPage = Number(searchParams.get('page')) || 1;
    const { lang } = useLanguage();
    const { institution } = useInstitution();

    const [searchQuery, setSearchQuery] = useState(query);
    const [showMinCharHint, setShowMinCharHint] = useState(false);

    const {
        data: searchData,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['search', query, activeType, currentPage],
        queryFn: () => fetchSearch(query, activeType, currentPage),
        enabled: query.length >= 2,
        staleTime: 1000 * 60,
    });

    const results = searchData?.results;

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        if (trimmed.length < 2) {
            setShowMinCharHint(true);
            return;
        }
        setShowMinCharHint(false);
        setSearchParams({ q: trimmed, type: activeType });
    };

    const switchType = (type: string) => {
        setSearchParams({ q: query, type });
    };

    const goToPage = (page: number) => {
        setSearchParams({ q: query, type: activeType, page: page.toString() });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalResults = results
        ? results.news.total + results.pages.total + results.events.total
        : 0;

    // Max last_page across all types (for "all" view)
    const maxLastPage = useMemo(() => {
        if (!results) return 1;
        if (activeType !== 'all') {
            const r = results[activeType as keyof typeof results] as
                | PaginatedSearchResult
                | undefined;
            return r?.last_page ?? 1;
        }
        return Math.max(
            results.news.last_page ?? 1,
            results.pages.last_page ?? 1,
            results.events.last_page ?? 1,
        );
    }, [activeType, results]);

    const typeFilters = [
        {
            key: 'all',
            label: t(lang, 'all'),
            icon: Search,
            count: totalResults,
        },
        {
            key: 'news',
            label: t(lang, 'news'),
            icon: Newspaper,
            count: results?.news.total ?? 0,
        },
        {
            key: 'pages',
            label: t(lang, 'pages'),
            icon: FileText,
            count: results?.pages.total ?? 0,
        },
        {
            key: 'events',
            label: t(lang, 'events'),
            icon: CalendarDays,
            count: results?.events.total ?? 0,
        },
    ];

    // Merge all results for the "all" view, or show only the selected type
    const sections: {
        key: string;
        label: string;
        items: SearchResultItem[];
    }[] = [];
    if (results) {
        if (activeType === 'all' || activeType === 'news') {
            if (results.news.data.length > 0) {
                sections.push({
                    key: 'news',
                    label: t(lang, 'news'),
                    items: results.news.data,
                });
            }
        }
        if (activeType === 'all' || activeType === 'pages') {
            if (results.pages.data.length > 0) {
                sections.push({
                    key: 'pages',
                    label: t(lang, 'pages'),
                    items: results.pages.data,
                });
            }
        }
        if (activeType === 'all' || activeType === 'events') {
            if (results.events.data.length > 0) {
                sections.push({
                    key: 'events',
                    label: t(lang, 'events'),
                    items: results.events.data,
                });
            }
        }
    }

    const hasAnyResults = sections.some((s) => s.items.length > 0);
    const institutionName = institution?.name || '';

    return (
        <div className="min-h-[60vh] py-6 md:py-10">
            <div className="mx-auto max-w-[690px] px-4">
                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-5">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                if (
                                    showMinCharHint &&
                                    e.target.value.trim().length >= 2
                                ) {
                                    setShowMinCharHint(false);
                                }
                            }}
                            placeholder={t(lang, 'search_placeholder')}
                            className="w-full rounded-full border border-gray-200 bg-white py-3 pr-4 pl-12 text-base shadow-sm transition-shadow focus:border-gray-300 focus:shadow-md focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                        />
                    </div>
                    {showMinCharHint && (
                        <p className="mt-1.5 pl-4 text-xs text-red-500">
                            {t(lang, 'min_chars')}
                        </p>
                    )}
                </form>

                {/* Type Filters — tab-style like Google */}
                <div className="mb-6 flex gap-1 border-b border-gray-200 dark:border-gray-700">
                    {typeFilters.map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => switchType(filter.key)}
                            className={`inline-flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                                activeType === filter.key
                                    ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] dark:border-[var(--brand-primary)] dark:text-[var(--brand-primary)]'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
                            }`}
                        >
                            <filter.icon className="h-4 w-4" />
                            {filter.label}
                            {query && (
                                <span className="ml-0.5 text-xs text-gray-400 dark:text-gray-500">
                                    {filter.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Results Area */}
                {!query ? (
                    /* Empty state — no query entered */
                    <div className="py-20 text-center">
                        <Search className="mx-auto mb-4 h-12 w-12 text-gray-200 dark:text-gray-700" />
                        <p className="text-gray-400 dark:text-gray-500">
                            {t(lang, 'type_to_search')}
                        </p>
                    </div>
                ) : isLoading ? (
                    <Loading />
                ) : error ? (
                    <ErrorState onRetry={() => refetch()} />
                ) : !hasAnyResults ? (
                    /* No results */
                    <div className="py-20 text-center">
                        <p className="text-base text-gray-700 dark:text-gray-300">
                            {t(lang, 'no_results')}{' '}
                            <span className="font-semibold">
                                &ldquo;{query}&rdquo;
                            </span>
                        </p>
                        <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                            {t(lang, 'try_different')}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Result count */}
                        <p className="mb-6 text-sm text-gray-400 dark:text-gray-500">
                            {t(lang, 'results_count').replace(
                                '{total}',
                                totalResults.toLocaleString(),
                            )}
                        </p>

                        {/* Result sections */}
                        {sections.map((section) => (
                            <div key={section.key} className="mb-4">
                                {/* Section header (only in "all" view) */}
                                {activeType === 'all' && (
                                    <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-100">
                                        {section.label}
                                        <span className="text-sm font-normal text-gray-400 dark:text-gray-500">
                                            (
                                            {results
                                                ? results[
                                                      section.key as keyof SearchResults['results']
                                                  ].total
                                                : 0}
                                            )
                                        </span>
                                    </h2>
                                )}

                                {/* Result items */}
                                {section.items.map((item) => (
                                    <ResultItem
                                        key={`${item.type}-${item.id}`}
                                        item={item}
                                        locale={lang}
                                        query={query}
                                        institutionName={institutionName}
                                    />
                                ))}

                                {/* Divider between sections */}
                                {activeType === 'all' && (
                                    <hr className="mb-6 border-gray-100 dark:border-gray-800" />
                                )}
                            </div>
                        ))}

                        {/* Pagination */}
                        <SearchPagination
                            currentPage={currentPage}
                            lastPage={maxLastPage}
                            locale={lang}
                            onPageChange={goToPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
