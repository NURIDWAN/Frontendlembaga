import apiClient from './client';
import type { ApiSuccessResponse, MenuItem } from '@/types';

export async function fetchMenus(): Promise<MenuItem[]> {
    const { data } =
        await apiClient.get<ApiSuccessResponse<MenuItem[]>>('/menus');
    return data.data;
}
