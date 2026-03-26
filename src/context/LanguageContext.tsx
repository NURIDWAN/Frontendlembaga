/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Language } from '@/types';

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (fields: { id?: string; en?: string; ar?: string }) => string;
    withLocale: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
    lang: 'id',
    setLang: () => {},
    t: (fields) => fields.id || '',
    withLocale: (path) => path,
});

function normalizePath(path: string): string {
    if (!path) return '/';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return path.startsWith('/') ? path : `/${path}`;
}

function extractLocaleFromPathname(pathname: string): Language | null {
    const match = pathname.match(/^\/(id|en|ar)(\/|$)/);
    return (match?.[1] as Language | undefined) ?? null;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const location = useLocation();
    const navigate = useNavigate();

    const [lang, setLang] = useState<Language>(() => {
        const fromUrl = extractLocaleFromPathname(window.location.pathname);
        return (
            fromUrl ||
            ((localStorage.getItem('lang') as Language) || 'id')
        );
    });

    // Keep context lang in sync with URL prefix.
    useEffect(() => {
        const fromUrl = extractLocaleFromPathname(location.pathname);
        if (fromUrl && fromUrl !== lang) {
            setLang(fromUrl);
            localStorage.setItem('lang', fromUrl);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    const handleSetLang = (newLang: Language) => {
        if (newLang === lang) return;
        const pathname = location.pathname;
        const replaced = pathname.replace(/^\/(id|en|ar)(\/|$)/, `/${newLang}$2`);
        // If there was no locale prefix (legacy links), prefix it.
        const nextPath =
            replaced === pathname ? `/${newLang}${normalizePath(pathname)}` : replaced;

        setLang(newLang);
        localStorage.setItem('lang', newLang);
        navigate(`${nextPath}${location.search}`, { replace: false });
    };

    const t = (fields: { id?: string; en?: string; ar?: string }): string => {
        const key = lang as keyof typeof fields;
        return fields[key] || fields.id || '';
    };

    const withLocale = useMemo(() => {
        return (path: string) => {
            const normalized = normalizePath(path);
            if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
                return normalized;
            }
            if (normalized === '#') return normalized;
            if (/^\/(id|en|ar)(\/|$)/.test(normalized)) return normalized;
            return `/${lang}${normalized}`;
        };
    }, [lang]);

    return (
        <LanguageContext.Provider
            value={{ lang, setLang: handleSetLang, t, withLocale }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
