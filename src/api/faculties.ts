import apiClient from './client';
import type {
    ApiPaginatedResponse,
    ApiSuccessResponse,
    Faculty,
    StudyProgram,
    DosenProfile,
} from '@/types';

interface FacultyDetailData {
    faculty: Faculty;
    study_programs: StudyProgram[];
    dosen_profiles: DosenProfile[];
}

interface StudyProgramDetailData {
    study_program: StudyProgram;
    faculty: Faculty | null;
    dosen_profiles: DosenProfile[];
    related_programs: StudyProgram[];
}

export async function fetchFaculties(
    page = 1,
): Promise<ApiPaginatedResponse<Faculty>> {
    const { data } = await apiClient.get<ApiPaginatedResponse<Faculty>>(
        '/faculties',
        {
            params: { page },
        },
    );
    return data;
}

export async function fetchFacultyDetail(
    slug: string,
): Promise<FacultyDetailData> {
    const { data } = await apiClient.get<ApiSuccessResponse<FacultyDetailData>>(
        `/faculties/${slug}`,
    );
    return data.data;
}

export async function fetchStudyProgramDetail(
    slug: string,
): Promise<StudyProgramDetailData> {
    const { data } = await apiClient.get<
        ApiSuccessResponse<StudyProgramDetailData>
    >(`/study-programs/${slug}`);
    return data.data;
}
