import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFoundPage() {
    const { lang, withLocale } = useLanguage();

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
            <h1 className="text-8xl font-bold text-[var(--brand-primary)] dark:text-[var(--brand-primary)]">
                404
            </h1>
            <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
                {lang === 'en' ? 'Page Not Found' : 'Halaman Tidak Ditemukan'}
            </h2>
            <p className="mt-2 max-w-md text-gray-500 dark:text-gray-400">
                {lang === 'en'
                    ? 'Sorry, the page you are looking for is not available or has been moved.'
                    : 'Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.'}
            </p>
            <div className="mt-8 flex gap-3">
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {lang === 'en' ? 'Go Back' : 'Kembali'}
                </button>
                <Link
                    to={withLocale('/')}
                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-secondary)] dark:bg-[var(--brand-primary)] dark:hover:bg-[var(--brand-secondary)]"
                >
                    <Home className="h-4 w-4" />
                    {lang === 'en' ? 'Home' : 'Beranda'}
                </Link>
            </div>
        </div>
    );
}
