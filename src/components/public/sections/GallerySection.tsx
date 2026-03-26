import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface GallerySectionProps {
    data: {
        title_id?: string;
        title_en?: string;
        title_ar?: string;
        columns?: number;
        images?: Array<{ url: string; caption?: string }>;
    };
    locale: string;
}

export function GallerySection({ data, locale }: GallerySectionProps) {
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

    const title =
        (locale === 'ar' && data.title_ar) ||
        (locale === 'en' && data.title_en) ||
        data.title_id ||
        '';

    const images = data.images || [];
    const columns = data.columns || 3;

    if (images.length === 0) return null;

    const gridCols =
        columns === 2
            ? 'grid-cols-1 sm:grid-cols-2'
            : columns === 4
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

    const resolveUrl = (url: string) =>
        url.startsWith('http') ? url : `/storage/${url}`;

    const goNext = () => {
        if (lightboxIdx !== null) {
            setLightboxIdx((lightboxIdx + 1) % images.length);
        }
    };

    const goPrev = () => {
        if (lightboxIdx !== null) {
            setLightboxIdx((lightboxIdx - 1 + images.length) % images.length);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowRight') goNext();
        if (e.key === 'ArrowLeft') goPrev();
    };

    return (
        <section
            className="py-12 md:py-16"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
            <div className="mx-auto max-w-6xl px-4">
                {title && (
                    <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                        {title}
                    </h2>
                )}
                <div className={`grid gap-4 ${gridCols}`}>
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setLightboxIdx(idx)}
                            className="group focus:ring-brand overflow-hidden rounded-xl focus:ring-2 focus:outline-none"
                        >
                            <img
                                src={resolveUrl(img.url)}
                                alt={img.caption || `Gallery ${idx + 1}`}
                                loading="lazy"
                                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {img.caption && (
                                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                                    {img.caption}
                                </p>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lightbox Dialog */}
            <Dialog
                open={lightboxIdx !== null}
                onOpenChange={(open) => {
                    if (!open) setLightboxIdx(null);
                }}
            >
                <DialogContent
                    className="max-w-5xl border-0 bg-black/90 p-0 shadow-2xl"
                    onKeyDown={handleKeyDown}
                >
                    {/* Visually hidden title for accessibility */}
                    <DialogTitle className="sr-only">
                        {lightboxIdx !== null
                            ? images[lightboxIdx]?.caption ||
                              `Gallery image ${lightboxIdx + 1} of ${images.length}`
                            : 'Gallery'}
                    </DialogTitle>

                    {lightboxIdx !== null && (
                        <div className="relative flex items-center justify-center p-4">
                            {/* Close button (Dialog handles Escape key automatically) */}
                            <button
                                type="button"
                                onClick={() => setLightboxIdx(null)}
                                className="absolute top-3 right-3 z-10 rounded-full bg-black/50 p-1.5 text-white transition-colors hover:bg-black/70"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Previous */}
                            {images.length > 1 && (
                                <button
                                    type="button"
                                    onClick={goPrev}
                                    className="absolute left-3 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                            )}

                            {/* Image */}
                            <img
                                src={resolveUrl(images[lightboxIdx].url)}
                                alt={
                                    images[lightboxIdx].caption ||
                                    `Gallery ${lightboxIdx + 1}`
                                }
                                className="max-h-[80vh] max-w-full rounded object-contain"
                            />

                            {/* Next */}
                            {images.length > 1 && (
                                <button
                                    type="button"
                                    onClick={goNext}
                                    className="absolute right-3 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            )}

                            {/* Caption + counter */}
                            {(images[lightboxIdx].caption ||
                                images.length > 1) && (
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center">
                                    {images[lightboxIdx].caption && (
                                        <p className="text-sm text-white/90">
                                            {images[lightboxIdx].caption}
                                        </p>
                                    )}
                                    {images.length > 1 && (
                                        <p className="mt-0.5 text-xs text-white/50">
                                            {lightboxIdx + 1} / {images.length}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    );
}
