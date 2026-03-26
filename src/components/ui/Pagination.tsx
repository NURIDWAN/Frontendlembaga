import type { PaginationMeta } from '@/types';

interface PaginationProps {
    meta: PaginationMeta;
    onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
    if (meta.last_page <= 1) return null;

    const pages: (number | string)[] = [];
    const current = meta.current_page;
    const last = meta.last_page;

    // Build page number array with ellipsis
    if (last <= 7) {
        for (let i = 1; i <= last; i++) pages.push(i);
    } else {
        pages.push(1);
        if (current > 3) pages.push('...');
        for (
            let i = Math.max(2, current - 1);
            i <= Math.min(last - 1, current + 1);
            i++
        ) {
            pages.push(i);
        }
        if (current < last - 2) pages.push('...');
        pages.push(last);
    }

    return (
        <div className="flex items-center justify-center gap-1 py-6">
            <button
                onClick={() => onPageChange(current - 1)}
                disabled={current === 1}
                className="rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800"
            >
                Sebelumnya
            </button>

            {pages.map((page, i) =>
                typeof page === 'string' ? (
                    <span
                        key={`ellipsis-${i}`}
                        className="px-2 text-gray-500 dark:text-gray-400"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            page === current
                                ? 'bg-brand text-brand-foreground'
                                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                        }`}
                    >
                        {page}
                    </button>
                ),
            )}

            <button
                onClick={() => onPageChange(current + 1)}
                disabled={current === last}
                className="rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800"
            >
                Selanjutnya
            </button>
        </div>
    );
}
