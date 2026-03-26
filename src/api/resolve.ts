import apiClient from './client';
import type { ApiSuccessResponse, Institution } from '@/types';

interface ResolveData {
    api_key: string;
    key_name: string;
    institution: Institution;
}

export async function resolveInstitution(
    subdomain: string,
): Promise<ResolveData> {
    const { data } = await apiClient.get<ApiSuccessResponse<ResolveData>>(
        '/resolve',
        {
            params: { subdomain },
        },
    );
    return data.data;
}
