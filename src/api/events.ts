import apiClient from './client';
import type { ApiPaginatedResponse, ApiSuccessResponse, Event } from '@/types';

export async function fetchEvents(
    page = 1,
): Promise<ApiPaginatedResponse<Event>> {
    const { data } = await apiClient.get<ApiPaginatedResponse<Event>>(
        '/events',
        {
            params: { page },
        },
    );
    return data;
}

export async function fetchEventDetail(id: number): Promise<Event> {
    const { data } = await apiClient.get<ApiSuccessResponse<Event>>(
        `/events/${id}`,
    );
    return data.data;
}
