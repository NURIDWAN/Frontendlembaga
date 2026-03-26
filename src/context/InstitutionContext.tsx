/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from 'react';
import type { Institution } from '@/types';
import { fetchInstitution } from '@/api/institution';
import { resolveInstitution } from '@/api/resolve';

interface InstitutionContextType {
    institution: Institution | null;
    apiKey: string | null;
    loading: boolean;
    error: string | null;
}

const InstitutionContext = createContext<InstitutionContextType>({
    institution: null,
    apiKey: null,
    loading: true,
    error: null,
});

export function InstitutionProvider({ children }: { children: ReactNode }) {
    const [institution, setInstitution] = useState<Institution | null>(null);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const envApiKey = import.meta.env.VITE_API_KEY as string | undefined;

        // ── Flow A: API key is pre-configured (preferred for multi-deploy) ──
        if (envApiKey) {
            // Always overwrite sessionStorage with the current env key.
            // This prevents stale data from a previous deploy (different lembaga)
            // from being returned when the API key has changed.
            sessionStorage.setItem('api_key', envApiKey);

            const cachedInstitution = sessionStorage.getItem('institution');
            const cachedForKey = sessionStorage.getItem('institution_key');

            // Only use the cached institution if it was fetched with THIS exact key.
            if (cachedForKey === envApiKey && cachedInstitution) {
                try {
                    queueMicrotask(() => {
                        setApiKey(envApiKey);
                        setInstitution(JSON.parse(cachedInstitution));
                        setLoading(false);
                    });
                    return;
                } catch {
                    // Corrupted cache — re-fetch
                    sessionStorage.removeItem('institution');
                    sessionStorage.removeItem('institution_key');
                }
            }

            fetchInstitution()
                .then((result) => {
                    setApiKey(envApiKey);
                    setInstitution(result);
                    sessionStorage.setItem('api_key', envApiKey);
                    sessionStorage.setItem(
                        'institution',
                        JSON.stringify(result),
                    );
                    // Tag the cached institution with the key it was fetched for,
                    // so we can invalidate it if the key changes.
                    sessionStorage.setItem('institution_key', envApiKey);
                })
                .catch(
                    (err: { response?: { data?: { message?: string } } }) => {
                        setError(
                            err.response?.data?.message ??
                                'Gagal memuat data lembaga',
                        );
                    },
                )
                .finally(() => {
                    setLoading(false);
                });

            return;
        }

        // ── Flow B: No API key — resolve via subdomain ──────────────────────
        const getSubdomain = (): string | null => {
            if (import.meta.env.DEV) {
                return import.meta.env.VITE_SUBDOMAIN || null;
            }
            const hostname = window.location.hostname;
            const parts = hostname.split('.');
            // If hostname has 3+ parts (sub.domain.tld), use the first part.
            // Otherwise fall back to VITE_SUBDOMAIN.
            if (parts.length >= 3) {
                return parts[0];
            }
            return import.meta.env.VITE_SUBDOMAIN || null;
        };

        const subdomain = getSubdomain();

        if (!subdomain) {
            queueMicrotask(() => {
                setError(
                    'Konfigurasi tidak lengkap: set VITE_API_KEY atau VITE_SUBDOMAIN di file .env. ' +
                        'Salin .env.example menjadi .env dan sesuaikan nilainya.',
                );
                setLoading(false);
            });
            return;
        }

        // Check session cache before calling /resolve
        const cachedKey = sessionStorage.getItem('api_key');
        const cachedInstitution = sessionStorage.getItem('institution');

        if (cachedKey && cachedInstitution) {
            try {
                queueMicrotask(() => {
                    setApiKey(cachedKey);
                    setInstitution(JSON.parse(cachedInstitution));
                    setLoading(false);
                });
                return;
            } catch {
                // Corrupted cache — re-resolve
                sessionStorage.removeItem('api_key');
                sessionStorage.removeItem('institution');
            }
        }

        resolveInstitution(subdomain)
            .then((result) => {
                setApiKey(result.api_key);
                setInstitution(result.institution);
                sessionStorage.setItem('api_key', result.api_key);
                sessionStorage.setItem(
                    'institution',
                    JSON.stringify(result.institution),
                );
            })
            .catch((err: { response?: { data?: { message?: string } } }) => {
                setError(
                    err.response?.data?.message ?? 'Gagal memuat data lembaga',
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <InstitutionContext.Provider
            value={{ institution, apiKey, loading, error }}
        >
            {children}
        </InstitutionContext.Provider>
    );
}

export function useInstitution() {
    return useContext(InstitutionContext);
}
