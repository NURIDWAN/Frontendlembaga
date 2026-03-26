import apiClient from './client';
import type { ApiSuccessResponse, SiteSettings } from '@/types';

export async function fetchSettings(): Promise<SiteSettings> {
    const { data } =
        await apiClient.get<ApiSuccessResponse<SiteSettings>>('/settings');
    return data.data;
}
