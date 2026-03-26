import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { InstitutionProvider } from '@/context/InstitutionContext';
import { LanguageProvider } from '@/context/LanguageContext';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 2, // 2 minutes
        },
    },
});

// Initialize dark mode from localStorage before React renders
const storedTheme = localStorage.getItem('theme');
if (
    storedTheme === 'dark' ||
    (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
    document.documentElement.classList.add('dark');
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <HelmetProvider>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <InstitutionProvider>
                        <LanguageProvider>
                            <App />
                        </LanguageProvider>
                    </InstitutionProvider>
                </BrowserRouter>
            </QueryClientProvider>
        </HelmetProvider>
    </StrictMode>,
);
