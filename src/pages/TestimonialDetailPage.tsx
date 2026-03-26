import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Quote } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { fetchTestimonialDetail } from '@/api/testimonials';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';

export default function TestimonialDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { lang, withLocale } = useLanguage();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['testimonial-detail', id],
        queryFn: () => fetchTestimonialDetail(id!),
        enabled: !!id,
    });

    if (isLoading) return <Loading />;
    if (error || !data) return <ErrorState onRetry={() => refetch()} />;

    const { testimonial, related } = data;

    return (
        <>
            <Helmet>
                <title>{testimonial.name}</title>
            </Helmet>

            <article className="py-8 md:py-12">
                <div className="mx-auto max-w-3xl px-4">
                    {/* Back link */}
                    <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Link
                            to={withLocale('/testimoni')}
                            className="inline-flex items-center gap-1 transition-colors hover:text-[var(--brand-primary)] dark:hover:text-[var(--brand-primary)]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {lang === 'id'
                                ? 'Kembali ke Testimoni'
                                : lang === 'ar'
                                  ? 'العودة إلى الشهادات'
                                  : 'Back to Testimonials'}
                        </Link>
                    </div>

                    {/* Profile photo */}
                    <div className="mb-6 flex justify-center">
                        {testimonial.photo ? (
                            <img
                                src={testimonial.photo_url || testimonial.photo}
                                alt={testimonial.name}
                                className="h-28 w-28 rounded-full object-cover shadow-md dark:shadow-gray-900/30"
                            />
                        ) : (
                            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[var(--brand-primary)] text-3xl font-bold text-white shadow-md dark:shadow-gray-900/30">
                                {testimonial.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* Name & role */}
                    <h1 className="mb-1 text-center text-2xl font-bold text-gray-900 dark:text-white">
                        {testimonial.name}
                    </h1>
                    {testimonial.role && (
                        <p className="mb-8 text-center text-sm text-gray-500 dark:text-gray-400">
                            {testimonial.role}
                        </p>
                    )}

                    {/* Quote */}
                    <div className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
                        <Quote className="mb-4 h-8 w-8 text-[var(--brand-primary)]/30 dark:text-[var(--brand-primary)]/30" />
                        <blockquote className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                            &ldquo;{testimonial.content}&rdquo;
                        </blockquote>
                    </div>
                </div>
            </article>

            {/* Related testimonials */}
            {related.length > 0 && (
                <section className="border-t border-gray-100 bg-gray-50 py-10 dark:border-gray-800 dark:bg-gray-800/50">
                    <div className="mx-auto max-w-4xl px-4">
                        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                            {lang === 'id'
                                ? 'Testimoni Lainnya'
                                : lang === 'ar'
                                  ? 'شهادات أخرى'
                                  : 'Other Testimonials'}
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {related.map((item) => (
                                <Link
                                    key={item.id}
                                    to={withLocale(`/testimoni/${item.id}`)}
                                    className="group rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800 dark:shadow-gray-900/30"
                                >
                                    <div className="mb-3 flex items-center gap-3">
                                        {item.photo ? (
                                            <img
                                                src={
                                                    item.photo_url || item.photo
                                                }
                                                alt={item.name}
                                                loading="lazy"
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-primary)] text-sm font-bold text-white">
                                                {item.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] dark:text-white dark:group-hover:text-[var(--brand-primary)]">
                                                {item.name}
                                            </p>
                                            {item.role && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {item.role}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <p className="line-clamp-3 text-xs text-gray-600 dark:text-gray-400">
                                        &ldquo;{item.content}&rdquo;
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
