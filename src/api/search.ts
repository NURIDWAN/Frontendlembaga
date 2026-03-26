import apiClient from './client';
import type { ApiSuccessResponse, SearchResults } from '@/types';

export async function fetchSearch(
    q: string,
    type = 'all',
    page = 1,
): Promise<SearchResults> {
    const { data } = await apiClient.get<ApiSuccessResponse<SearchResults>>(
        '/search',
        {
            params: { q, type, page },
        },
    );
    return data.data;
}
