import apiClient from './client';
import type { ApiSuccessResponse, Page } from '@/types';

/**
 * Fetch homepage with builder sections (ordered by DB).
 */
export async function fetchHomePage(): Promise<Page> {
    const { data } = await apiClient.get<ApiSuccessResponse<Page>>(
        '/pages/home',
    );
    return data.data;
}

/**
 * Fetch a page by slug with builder sections (ordered by DB).
 */
export async function fetchPage(slug: string): Promise<Page> {
    const { data } = await apiClient.get<ApiSuccessResponse<Page>>(
        `/pages/${slug}`,
    );
    return data.data;
}
