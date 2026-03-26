import apiClient from './client';
import type { ApiSuccessResponse, Faq } from '@/types';

export async function fetchFaqs(): Promise<Faq[]> {
    const { data } = await apiClient.get<ApiSuccessResponse<Faq[]>>('/faqs');
    return data.data;
}
