import apiClient from './client';
import type {
    ApiPaginatedResponse,
    ApiSuccessResponse,
    DosenProfile,
} from '@/types';

interface DosenDetailData {
    dosen: DosenProfile;
}

export async function fetchDosenList(
    page = 1,
    search = '',
    studyProgramId?: number,
): Promise<ApiPaginatedResponse<DosenProfile>> {
    const params: Record<string, string | number> = { page };
    if (search) params.search = search;
    if (studyProgramId) params.study_program_id = studyProgramId;

    const { data } = await apiClient.get<ApiPaginatedResponse<DosenProfile>>(
        '/dosen',
        {
            params,
        },
    );
    return data;
}

export async function fetchDosenDetail(id: number): Promise<DosenProfile> {
    const { data } = await apiClient.get<ApiSuccessResponse<DosenDetailData>>(
        `/dosen/${id}`,
    );
    return data.data.dosen;
}
