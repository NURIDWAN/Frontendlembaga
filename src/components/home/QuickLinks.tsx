import { ExternalLink } from 'lucide-react';
import React from 'react';
import type { QuickLink } from '@/types';

interface QuickLinksSectionProps {
    quickLinks: QuickLink[];
    hasSlider?: boolean;
    scrollSpeed?: number;
}

export default function QuickLinks({
    quickLinks,
    hasSlider = true,
    scrollSpeed = 40,
}: QuickLinksSectionProps) {
    if (quickLinks.length === 0) return null;

    const items = [...quickLinks, ...quickLinks];

    return (
        <section
            className={`relative z-10 overflow-hidden px-4 pb-12 ${hasSlider ? '-mt-12 md:-mt-16' : 'pt-8 md:pt-12'}`}
        >
            <div className="mx-auto max-w-7xl">
                <div
                    className="pause-on-hover group relative flex overflow-hidden"
                    style={
                        {
                            '--scroll-speed': `${scrollSpeed}s`,
                        } as React.CSSProperties
                    }
                >
                    <div className="animate-infinite-scroll-x flex shrink-0 gap-4 py-4">
                        {items.map((link, index) => (
                            <a
                                key={`${link.id}-${index}`}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-[180px] shrink-0 flex-col items-center rounded-xl bg-white p-4 text-center shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl md:w-[220px] md:p-5 dark:bg-gray-800 dark:shadow-gray-900/30"
                            >
                                <div
                                    className="mb-3 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl text-white md:h-14 md:w-14"
                                    style={{ backgroundColor: link.color }}
                                >
                                    {link.logo_url ? (
                                        <img
                                            src={link.logo_url}
                                            alt={link.title}
                                            className="h-full w-full object-contain p-1.5"
                                        />
                                    ) : link.icon ? (
                                        <span className="text-xl md:text-2xl">
                                            {link.icon}
                                        </span>
                                    ) : (
                                        <ExternalLink className="h-5 w-5 md:h-6 md:w-6" />
                                    )}
                                </div>
                                <h3 className="mb-1 line-clamp-1 text-sm font-bold text-gray-800 hover:text-[var(--brand-primary)] md:text-base dark:text-gray-100 dark:hover:text-[var(--brand-primary)]">
                                    {link.title}
                                </h3>
                                {link.description && (
                                    <p className="line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                                        {link.description}
                                    </p>
                                )}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
