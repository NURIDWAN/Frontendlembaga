import apiClient from './client';
import type { ApiPaginatedResponse, ApiSuccessResponse, Career } from '@/types';

interface CareerDetailData {
    career: Career;
    related: Career[];
}

export async function fetchCareers(
    page = 1,
): Promise<ApiPaginatedResponse<Career>> {
    const { data } = await apiClient.get<ApiPaginatedResponse<Career>>(
        '/careers',
        {
            params: { page },
        },
    );
    return data;
}

export async function fetchCareerDetail(id: number): Promise<CareerDetailData> {
    const { data } = await apiClient.get<ApiSuccessResponse<CareerDetailData>>(
        `/careers/${id}`,
    );
    return data.data;
}
