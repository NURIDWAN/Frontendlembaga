import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Quote } from 'lucide-react';
import { fetchTestimonials } from '@/api/testimonials';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';
import { Pagination } from '@/components/ui/Pagination';

export default function TestimonialsPage() {
    const { lang, withLocale } = useLanguage();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['testimonials', page],
        queryFn: () => fetchTestimonials(page),
    });

    if (isLoading) return <Loading />;
    if (error || !data) return <ErrorState onRetry={() => refetch()} />;

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
                        {lang === 'en' ? 'Home' : 'Beranda'}
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                        {lang === 'en' ? 'Testimonials' : 'Testimoni'}
                    </h1>
                    <div className="mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                </div>

                {/* Testimonials Grid */}
                {data.data.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {data.data.map((testimonial) => (
                            <Link
                                key={testimonial.id}
                                to={withLocale(`/testimoni/${testimonial.id}`)}
                                className="group rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
                            >
                                <Quote className="mb-3 h-6 w-6 text-[var(--brand-primary)]/20 dark:text-[var(--brand-primary)]/20" />
                                <blockquote className="mb-4 line-clamp-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                    &ldquo;{testimonial.content}&rdquo;
                                </blockquote>
                                <div className="flex items-center gap-3 border-t border-gray-100 pt-4 dark:border-gray-700">
                                    {testimonial.photo_url ||
                                    testimonial.photo ? (
                                        <img
                                            src={
                                                testimonial.photo_url ||
                                                testimonial.photo!
                                            }
                                            alt={testimonial.name}
                                            loading="lazy"
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-primary)] text-sm font-bold text-white dark:bg-[var(--brand-primary)]">
                                            {testimonial.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] dark:text-white dark:group-hover:text-[var(--brand-primary)]">
                                            {testimonial.name}
                                        </p>
                                        {testimonial.role && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {testimonial.role}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                            {lang === 'en'
                                ? 'No testimonials available yet.'
                                : 'Belum ada testimoni.'}
                        </p>
                    </div>
                )}

                <Pagination
                    meta={data.meta}
                    onPageChange={(p) => {
                        setSearchParams({ page: p.toString() });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                />
            </div>
        </div>
    );
}
