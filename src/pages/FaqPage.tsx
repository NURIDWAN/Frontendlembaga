import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchFaqs } from '@/api/faqs';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';

interface FaqItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
}

function AccordionItem({ question, answer, isOpen, onToggle }: FaqItemProps) {
    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <button
                onClick={onToggle}
                className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-[var(--brand-primary)] dark:hover:text-[var(--brand-primary)]"
            >
                <span className="pr-4 text-base font-semibold text-gray-900 dark:text-white">
                    {question}
                </span>
                {isOpen ? (
                    <ChevronUp className="h-5 w-5 flex-shrink-0 text-[var(--brand-primary)] dark:text-[var(--brand-primary)]" />
                ) : (
                    <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-400" />
                )}
            </button>
            {isOpen && (
                <div className="pb-4">
                    <div
                        className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: answer }}
                    />
                </div>
            )}
        </div>
    );
}

export default function FaqPage() {
    const { lang, withLocale } = useLanguage();

    const {
        data: faqs,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['faqs'],
        queryFn: fetchFaqs,
        staleTime: 1000 * 60 * 5,
    });

    // Open first item by default (matching Inertia)
    const [openId, setOpenId] = useState<number | null>(null);

    if (isLoading) return <Loading />;
    if (error || !faqs) return <ErrorState onRetry={() => refetch()} />;

    // Set first item open on initial load
    if (openId === null && faqs.length > 0) {
        setOpenId(faqs[0].id);
    }

    return (
        <div className="py-8 md:py-12">
            <div className="mx-auto max-w-3xl px-4">
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
                        {lang === 'en'
                            ? 'Frequently Asked Questions'
                            : 'Pertanyaan yang Sering Diajukan'}
                    </h1>
                    <div className="mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                </div>

                {/* Accordion */}
                {faqs.length > 0 ? (
                    <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
                        {faqs.map((faq) => {
                            const question =
                                lang === 'en'
                                    ? faq.question_en
                                    : lang === 'ar'
                                      ? faq.question_ar
                                      : faq.question_id;
                            const answer =
                                lang === 'en'
                                    ? faq.answer_en
                                    : lang === 'ar'
                                      ? faq.answer_ar
                                      : faq.answer_id;
                            return (
                                <AccordionItem
                                    key={faq.id}
                                    question={question}
                                    answer={answer}
                                    isOpen={openId === faq.id}
                                    onToggle={() =>
                                        setOpenId(
                                            openId === faq.id ? null : faq.id,
                                        )
                                    }
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                            {lang === 'en'
                                ? 'No FAQs available yet.'
                                : 'Belum ada FAQ.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
