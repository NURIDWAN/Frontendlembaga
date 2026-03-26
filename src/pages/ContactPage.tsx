import { useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Phone,
    Printer,
    Mail,
    Clock,
    Send,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import { sendContact } from '@/api/contact';
import { fetchSettings } from '@/api/settings';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

function getGoogleMapsEmbedHtml(embedValue?: string): string | null {
    const value = (embedValue || '').trim();
    if (!value) return null;

    if (value.toLowerCase().includes('<iframe')) {
        return value;
    }

    const safeUrl = /^(https?:)?\/\//i.test(value)
        ? value
        : `https://${value.replace(/^\/+/, '')}`;

    return `<iframe src="${safeUrl}" style="border:0;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
}

export default function ContactPage() {
    const { lang, withLocale } = useLanguage();
    const [form, setForm] = useState<FormData>({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { data: settings, isLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: fetchSettings,
        staleTime: 1000 * 60 * 10,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const message = await sendContact(form);
            setSuccess(
                message ||
                    (lang === 'en'
                        ? 'Message sent successfully!'
                        : 'Pesan berhasil dikirim!'),
            );
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (err: unknown) {
            const msg =
                err instanceof Error
                    ? err.message
                    : lang === 'en'
                      ? 'Failed to send message'
                      : 'Gagal mengirim pesan';
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const address =
        settings?.address || 'Jl. Taman Siswa (Pekeng) Tahunan, Jepara 59427';
    const phone = settings?.phone || '(0291) 593132';
    const emailAddr = settings?.email || 'info@iaiku-blora.ac.id';
    const mapsEmbedHtml = getGoogleMapsEmbedHtml(settings?.google_maps_embed);

    return (
        <div className="py-8 md:py-12">
            <div className="mx-auto max-w-7xl px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to={withLocale('/')}
                        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-[var(--brand-primary)] dark:text-gray-400 dark:hover:text-[var(--brand-primary)]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {lang === 'en' ? 'Home' : 'Beranda'}
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                        {lang === 'en' ? 'Contact Us' : 'Hubungi Kami'}
                    </h1>
                    <div className="mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 flex items-center gap-3 rounded-lg border border-[var(--brand-primary)]/30 bg-[var(--brand-primary)]/10 p-4 text-sm text-[var(--brand-primary)] dark:border-[var(--brand-primary)]/40 dark:bg-[var(--brand-primary)]/20 dark:text-[var(--brand-primary)]">
                        <CheckCircle className="h-5 w-5 shrink-0" />
                        <p>{success}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Contact Form */}
                    <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            {lang === 'en' ? 'Send a Message' : 'Kirim Pesan'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {lang === 'en' ? 'Name' : 'Nama'} *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-[var(--brand-primary)] dark:focus:ring-[var(--brand-primary)]"
                                    placeholder={
                                        lang === 'en'
                                            ? 'Enter your name'
                                            : 'Masukkan nama Anda'
                                    }
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-[var(--brand-primary)] dark:focus:ring-[var(--brand-primary)]"
                                    placeholder={
                                        lang === 'en'
                                            ? 'Enter your email'
                                            : 'Masukkan email Anda'
                                    }
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {lang === 'en' ? 'Subject' : 'Subjek'} *
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-[var(--brand-primary)] dark:focus:ring-[var(--brand-primary)]"
                                    placeholder={
                                        lang === 'en'
                                            ? 'Enter message subject'
                                            : 'Masukkan subjek pesan'
                                    }
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {lang === 'en' ? 'Message' : 'Pesan'} *
                                </label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-[var(--brand-primary)] dark:focus:ring-[var(--brand-primary)]"
                                    placeholder={
                                        lang === 'en'
                                            ? 'Write your message here...'
                                            : 'Tulis pesan Anda di sini...'
                                    }
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-primary)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-secondary)] disabled:opacity-50 dark:bg-[var(--brand-primary)] dark:hover:bg-[var(--brand-secondary)]"
                            >
                                <Send className="h-4 w-4" />
                                {submitting
                                    ? lang === 'en'
                                        ? 'Sending...'
                                        : 'Mengirim...'
                                    : lang === 'en'
                                      ? 'Send Message'
                                      : 'Kirim Pesan'}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info + Map */}
                    <div className="space-y-6">
                        {/* Contact Information */}
                        {isLoading ? (
                            <Loading
                                text={
                                    lang === 'en'
                                        ? 'Loading contact info...'
                                        : 'Memuat info kontak...'
                                }
                            />
                        ) : (
                            <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                    {lang === 'en'
                                        ? 'Contact Information'
                                        : 'Informasi Kontak'}
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--brand-primary)]/10 dark:bg-[var(--brand-primary)]/30">
                                            <MapPin className="h-5 w-5 text-[var(--brand-primary)] dark:text-[var(--brand-primary)]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {lang === 'en'
                                                    ? 'Address'
                                                    : 'Alamat'}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {address}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--brand-primary)]/10 dark:bg-[var(--brand-primary)]/30">
                                            <Phone className="h-5 w-5 text-[var(--brand-primary)] dark:text-[var(--brand-primary)]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {lang === 'en'
                                                    ? 'Phone'
                                                    : 'Telepon'}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {phone}
                                            </p>
                                        </div>
                                    </div>
                                    {settings?.fax && (
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--brand-primary)]/10 dark:bg-[var(--brand-primary)]/30">
                                                <Printer className="h-5 w-5 text-[var(--brand-primary)] dark:text-[var(--brand-primary)]" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Fax
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {settings.fax}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--brand-primary)]/10 dark:bg-[var(--brand-primary)]/30">
                                            <Mail className="h-5 w-5 text-[var(--brand-primary)] dark:text-[var(--brand-primary)]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                Email
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {emailAddr}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--brand-primary)]/10 dark:bg-[var(--brand-primary)]/30">
                                            <Clock className="h-5 w-5 text-[var(--brand-primary)] dark:text-[var(--brand-primary)]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {lang === 'en'
                                                    ? 'Office Hours'
                                                    : 'Jam Operasional'}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {lang === 'en'
                                                    ? 'Monday - Friday: 08:00 AM - 04:00 PM'
                                                    : 'Senin - Jumat: 08:00 - 16:00 WIB'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Google Maps Embed */}
                        {mapsEmbedHtml && (
                            <div className="overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800">
                                <div
                                    className="aspect-video w-full [&>iframe]:h-full [&>iframe]:w-full"
                                    dangerouslySetInnerHTML={{
                                        __html: mapsEmbedHtml,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
