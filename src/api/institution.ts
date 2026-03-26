import apiClient from './client';
import type { ApiSuccessResponse, Institution } from '@/types';

/**
 * Fetch the institution associated with the authenticated API key.
 *
 * Calls GET /api/v1/institution — authenticated via X-API-Key header
 * (automatically added by the axios interceptor in client.ts).
 *
 * This is used when VITE_API_KEY is pre-configured in the environment,
 * so there is no need to know the subdomain upfront.
 */
export async function fetchInstitution(): Promise<Institution> {
    const { data } =
        await apiClient.get<ApiSuccessResponse<Institution>>('/institution');
    return data.data;
}
