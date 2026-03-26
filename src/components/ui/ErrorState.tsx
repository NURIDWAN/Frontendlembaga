import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({
    title = 'Terjadi Kesalahan',
    message = 'Gagal memuat data. Silakan coba lagi.',
    onRetry,
}: ErrorStateProps) {
    return (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {message}
                </p>
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="bg-brand text-brand-foreground hover:bg-brand-hover rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                >
                    Coba Lagi
                </button>
            )}
        </div>
    );
}
