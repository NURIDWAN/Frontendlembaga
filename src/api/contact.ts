import apiClient from './client';
import type { ApiSuccessResponse } from '@/types';

interface ContactPayload {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export async function sendContact(payload: ContactPayload): Promise<string> {
    const { data } = await apiClient.post<ApiSuccessResponse<null>>(
        '/contact',
        payload,
    );
    return data.message;
}
