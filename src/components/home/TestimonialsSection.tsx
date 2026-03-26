import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import type { Testimonial } from '@/types';

interface TestimonialsSectionProps {
    testimonials: Testimonial[];
    settings?: Record<string, unknown>;
}

export default function TestimonialsSection({
    testimonials,
    settings,
}: TestimonialsSectionProps) {
    const { lang, withLocale } = useLanguage();
    const [current, setCurrent] = useState(0);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
    }, [testimonials.length]);

    const prev = useCallback(() => {
        setCurrent(
            (prev) => (prev - 1 + testimonials.length) % testimonials.length,
        );
    }, [testimonials.length]);

    useEffect(() => {
        if (testimonials.length <= 1) return;
        const timer = setInterval(next, 6000);
        return () => clearInterval(timer);
    }, [next, testimonials.length]);

    if (testimonials.length === 0) return null;

    const testimonial = testimonials[current];

    return (
        <section className="py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4">
                <div className="mb-10 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                        {lang === 'ar'
                            ? 'الشهادات'
                            : lang === 'en'
                              ? 'Testimonials'
                              : 'Testimoni'}
                    </h2>
                    <div className="mx-auto mt-4 mb-4 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                    <p className="mx-auto max-w-2xl text-gray-500 dark:text-gray-400">
                        {settings &&
                        (settings.subtitle_id ||
                            settings.subtitle_en ||
                            settings.subtitle_ar)
                            ? lang === 'ar' && settings.subtitle_ar
                                ? (settings.subtitle_ar as string)
                                : lang === 'en' && settings.subtitle_en
                                  ? (settings.subtitle_en as string)
                                  : (settings.subtitle_id as string) || ''
                            : lang === 'ar'
                              ? 'ماذا يقولون عنا'
                              : lang === 'en'
                                ? 'What they say about us'
                                : 'Pengalaman dan pendapat mereka yang telah menjadi bagian dari perjalanan kami.'}
                    </p>
                </div>

                <div className="relative mx-auto max-w-3xl">
                    <div className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-lg md:p-12 dark:bg-gray-800 dark:shadow-gray-900/30">
                        {testimonial.photo ? (
                            <img
                                src={testimonial.photo_url || testimonial.photo}
                                alt={testimonial.name}
                                loading="lazy"
                                className="mb-4 h-20 w-20 rounded-full object-cover shadow-sm"
                            />
                        ) : (
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--brand-primary)] text-2xl font-bold text-white shadow-sm">
                                {testimonial.name.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {testimonial.name}
                        </h3>
                        {testimonial.role && (
                            <p className="mb-4 text-sm font-medium text-[var(--brand-primary)] dark:text-[var(--brand-primary)]">
                                {testimonial.role}
                            </p>
                        )}
                        {!testimonial.role && <div className="mb-4" />}

                        <blockquote className="mb-6 line-clamp-1 max-w-2xl text-base leading-relaxed text-gray-700 italic md:text-lg dark:text-gray-300">
                            &ldquo;{testimonial.content}&rdquo;
                        </blockquote>

                        <Link
                            to={withLocale(`/testimoni/${testimonial.id}`)}
                            className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-primary)]/10 px-4 py-2 text-sm font-medium text-[var(--brand-primary)] transition-colors hover:bg-[var(--brand-primary)]/20 dark:bg-[var(--brand-primary)]/10 dark:text-[var(--brand-primary)] dark:hover:bg-[var(--brand-primary)]/20"
                        >
                            {lang === 'ar'
                                ? 'اقرأ المزيد'
                                : lang === 'en'
                                  ? 'Read More'
                                  : 'Selengkapnya'}
                        </Link>
                    </div>

                    {testimonials.length > 1 && (
                        <>
                            <button
                                onClick={prev}
                                className="absolute top-1/2 -left-4 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-50 md:-left-6 dark:bg-gray-700 dark:hover:bg-gray-600"
                                aria-label="Previous testimonial"
                            >
                                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </button>
                            <button
                                onClick={next}
                                className="absolute top-1/2 -right-4 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-50 md:-right-6 dark:bg-gray-700 dark:hover:bg-gray-600"
                                aria-label="Next testimonial"
                            >
                                <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </button>

                            <div className="mt-6 flex justify-center gap-2">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrent(index)}
                                        className={`h-2.5 w-2.5 rounded-full transition-colors ${
                                            index === current
                                                ? 'bg-[var(--brand-primary)] dark:bg-[var(--brand-primary)]'
                                                : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                        aria-label={`Go to testimonial ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <Link
                        to={withLocale('/testimoni')}
                        className="inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-secondary)]"
                    >
                        {lang === 'ar'
                            ? 'عرض كل الشهادات'
                            : lang === 'en'
                              ? 'View All Testimonials'
                              : 'Lihat Semua Testimoni'}
                        <ArrowRight
                            className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${
                                lang === 'ar'
                                    ? 'rotate-180 group-hover:-translate-x-1'
                                    : ''
                            }`}
                        />
                    </Link>
                </div>
            </div>
        </section>
    );
}
