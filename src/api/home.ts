import apiClient from './client';
import type { ApiSuccessResponse, HomeData } from '@/types';

export async function fetchHome(): Promise<HomeData> {
    const { data } = await apiClient.get<ApiSuccessResponse<HomeData>>('/home');
    return data.data;
}
