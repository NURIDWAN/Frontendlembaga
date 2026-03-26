import type { PopupBanner as PopupBannerData } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { fetchHome } from '@/api/home';

interface Props {
    lang: string;
    institutionId?: number;
}

type CloseMode = 'session' | '1_day' | '7_days' | 'until_updated';

function getLocalized(
    lang: string,
    idValue?: string,
    enValue?: string,
    arValue?: string,
): string {
    if (lang === 'ar') return arValue || idValue || '';
    if (lang === 'en') return enValue || idValue || '';
    return idValue || '';
}

function isWithinSchedule(startAt?: string, endAt?: string): boolean {
    const now = Date.now();
    const start = startAt ? Date.parse(startAt) : Number.NaN;
    const end = endAt ? Date.parse(endAt) : Number.NaN;

    if (!Number.isNaN(start) && now < start) return false;
    if (!Number.isNaN(end) && now > end) return false;

    return true;
}

function getStorageKey(institutionId: number, popupVersion: string): string {
    return `popup_closed_${institutionId}_${popupVersion}`;
}

function isClosed(storageKey: string, closeMode: CloseMode): boolean {
    if (closeMode === 'session') {
        return sessionStorage.getItem(storageKey) === '1';
    }

    const raw = localStorage.getItem(storageKey);
    if (!raw) return false;

    if (closeMode === 'until_updated') {
        return raw === '1';
    }

    const expireAt = Number.parseInt(raw, 10);
    return !Number.isNaN(expireAt) && Date.now() < expireAt;
}

function markClosed(storageKey: string, closeMode: CloseMode): void {
    if (closeMode === 'session') {
        sessionStorage.setItem(storageKey, '1');
        return;
    }

    if (closeMode === 'until_updated') {
        localStorage.setItem(storageKey, '1');
        return;
    }

    const days = closeMode === '7_days' ? 7 : 1;
    const expireAt = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem(storageKey, String(expireAt));
}

function getPopupMaxWidthClass(size: 'sm' | 'md' | 'lg'): string {
    if (size === 'sm') return 'max-w-md';
    if (size === 'lg') return 'max-w-3xl';

    return 'max-w-xl';
}

function getPopupImageClass(mode: 'portrait' | 'landscape'): string {
    return mode === 'portrait'
        ? 'h-[70vh] max-h-[700px] w-full object-cover'
        : 'h-56 w-full object-cover';
}

export default function PopupBanner({ lang, institutionId }: Props) {
    const { data: homeData } = useQuery({
        queryKey: ['home'],
        queryFn: fetchHome,
        staleTime: 1000 * 60 * 10,
    });

    const banners: PopupBannerData[] = homeData?.popup_banners || [];
    const activeBanner = banners.find((banner) => banner.is_active) || null;
    const popupEnabled = !!activeBanner;
    const popupVersion = activeBanner
        ? `${activeBanner.id}-${activeBanner.updated_at || ''}`
        : 'v1';
    const closeMode = activeBanner?.close_mode || 'until_updated';
    const popupSize = activeBanner?.popup_size || 'md';
    const imageMode = activeBanner?.image_mode || 'landscape';
    const popupTitle = getLocalized(lang, activeBanner?.title || '');
    const popupContent = getLocalized(lang, activeBanner?.content || '');
    const popupCtaLabel = getLocalized(lang, activeBanner?.cta_label || '');
    const popupCtaUrl = (activeBanner?.cta_url || '').trim();
    const popupImage = activeBanner?.image_url || activeBanner?.image || '';
    const storageKey = getStorageKey(institutionId || 0, popupVersion);

    const shouldOpen = useMemo(() => {
        if (!popupEnabled) return false;
        if (!popupTitle && !popupContent && !popupImage) return false;
        if (
            !isWithinSchedule(
                activeBanner?.start_at || '',
                activeBanner?.end_at || '',
            )
        ) {
            return false;
        }

        return !isClosed(storageKey, closeMode);
    }, [
        closeMode,
        popupContent,
        popupEnabled,
        activeBanner,
        popupImage,
        popupTitle,
        storageKey,
    ]);

    const [open, setOpen] = useState(shouldOpen);

    useEffect(() => {
        setOpen(shouldOpen);
    }, [shouldOpen]);

    const handleClose = () => {
        markClosed(storageKey, closeMode);
        setOpen(false);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div
                className={`relative w-full overflow-hidden rounded-2xl border bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900 ${getPopupMaxWidthClass(popupSize)}`}
            >
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute top-3 right-3 z-10 rounded-full bg-black/40 p-1.5 text-white transition-colors hover:bg-black/60"
                    aria-label="Close popup"
                >
                    <X className="h-4 w-4" />
                </button>

                {popupImage && (
                    <img
                        src={popupImage}
                        alt={popupTitle || 'Popup Banner'}
                        className={getPopupImageClass(imageMode)}
                    />
                )}

                <div className="space-y-3 p-5">
                    {popupTitle && (
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {popupTitle}
                        </h3>
                    )}

                    {popupContent && (
                        <div
                            className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300 dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: popupContent }}
                        />
                    )}

                    {popupCtaUrl && popupCtaLabel && (
                        <a
                            href={popupCtaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
                        >
                            {popupCtaLabel}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
