import apiClient from './client';
import type {
    Announcement,
    ApiPaginatedResponse,
    ApiSuccessResponse,
} from '@/types';

interface AnnouncementDetailData {
    announcement: Announcement;
    related: Announcement[];
}

export async function fetchAnnouncements(
    page = 1,
): Promise<ApiPaginatedResponse<Announcement>> {
    const { data } = await apiClient.get<ApiPaginatedResponse<Announcement>>(
        '/announcements',
        {
            params: { page },
        },
    );

    return data;
}

export async function fetchAnnouncementDetail(
    slug: string,
): Promise<AnnouncementDetailData> {
    const { data } = await apiClient.get<
        ApiSuccessResponse<AnnouncementDetailData>
    >(`/announcements/${slug}`);

    return data.data;
}
