import { useLanguage } from '@/context/LanguageContext';
import type { Language } from '@/types';

/**
 * Helper hook to get a translated field from a multilingual object.
 * Usage: const title = useTranslatedField(news, 'title');
 */
export function useTranslatedField<T extends Record<string, unknown>>(
    obj: T | null | undefined,
    fieldPrefix: string,
): string {
    const { lang } = useLanguage();
    if (!obj) return '';
    const key = `${fieldPrefix}_${lang}` as keyof T;
    const fallback = `${fieldPrefix}_id` as keyof T;
    return (obj[key] as string) || (obj[fallback] as string) || '';
}

/**
 * Get the field suffix key for the current language.
 */
export function useLangSuffix(): Language {
    const { lang } = useLanguage();
    return lang;
}
