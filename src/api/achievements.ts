import apiClient from './client';
import type {
    ApiPaginatedResponse,
    ApiSuccessResponse,
    Achievement,
    AchievementFilters,
} from '@/types';

interface AchievementsResponse extends ApiPaginatedResponse<Achievement> {
    filters: AchievementFilters;
}

export async function fetchAchievements(
    params: {
        page?: number;
        year?: number | string;
        category?: string;
    } = {},
): Promise<AchievementsResponse> {
    const { data } = await apiClient.get<AchievementsResponse>(
        '/achievements',
        { params },
    );
    return data;
}

interface AchievementDetailData {
    achievement: Achievement;
    related: Achievement[];
}

export async function fetchAchievementDetail(
    id: number | string,
): Promise<AchievementDetailData> {
    const { data } = await apiClient.get<
        ApiSuccessResponse<AchievementDetailData>
    >(`/achievements/${id}`);
    return data.data;
}
