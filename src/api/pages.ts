import apiClient from './client';
import type { ApiSuccessResponse, Page } from '@/types';

export async function fetchPage(slug: string): Promise<Page> {
    const { data } = await apiClient.get<ApiSuccessResponse<Page>>(
        `/pages/${slug}`,
    );
    return data.data;
}
