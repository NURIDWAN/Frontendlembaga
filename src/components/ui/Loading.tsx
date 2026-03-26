import { Loader2 } from 'lucide-react';

export function Loading({ text = 'Memuat...' }: { text?: string }) {
    return (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
            <Loader2 className="text-brand h-8 w-8 animate-spin" />
            <p className="text-sm text-muted-foreground">{text}</p>
        </div>
    );
}

export function LoadingPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3">
            <Loader2 className="text-brand h-10 w-10 animate-spin" />
            <p className="text-muted-foreground">Memuat halaman...</p>
        </div>
    );
}
