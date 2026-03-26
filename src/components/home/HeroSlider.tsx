import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import type { Slider } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface HeroSliderProps {
    sliders: Slider[];
}

export default function HeroSlider({ sliders }: HeroSliderProps) {
    const { lang } = useLanguage();
    const [current, setCurrent] = useState(0);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % sliders.length);
    }, [sliders.length]);

    const prev = useCallback(() => {
        setCurrent((prev) => (prev - 1 + sliders.length) % sliders.length);
    }, [sliders.length]);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next]);

    if (sliders.length === 0) return null;

    const slide = sliders[current];

    return (
        <section className="relative h-[400px] w-full overflow-hidden md:h-[500px] lg:h-[600px]">
            {/* Slides */}
            {sliders.map((s, index) => (
                <div
                    key={s.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                        index === current ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <img
                        src={s.image}
                        alt={s.title}
                        className="h-full w-full object-cover"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
            ))}

            {/* Content */}
            <div className="absolute inset-0 flex items-end">
                <div className="mx-auto w-full max-w-7xl px-4 pb-24 md:pb-32 lg:pb-36">
                    {slide.badge && (
                        <span className="mb-3 inline-block rounded-full bg-orange-600 px-4 py-1 text-sm font-semibold text-white">
                            {slide.badge}
                        </span>
                    )}
                    <h2 className="mb-2 max-w-2xl text-2xl font-bold text-white md:text-4xl lg:text-5xl">
                        {slide.title}
                    </h2>
                    {slide.description && (
                        <p className="max-w-xl text-sm text-white/80 md:text-base">
                            {slide.description}
                        </p>
                    )}
                    {slide.link && (
                        <a
                            href={slide.link}
                            className="mt-4 inline-block rounded-lg bg-[var(--brand-primary)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-secondary)]"
                        >
                            {lang === 'ar'
                                ? 'المزيد'
                                : lang === 'en'
                                  ? 'Read More'
                                  : 'Selengkapnya'}
                        </a>
                    )}
                </div>
            </div>

            {/* Navigation arrows */}
            {sliders.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                        {sliders.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
                                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                                    index === current
                                        ? 'bg-white'
                                        : 'bg-white/40'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
