import apiClient from './client';
import type {
    ApiPaginatedResponse,
    ApiSuccessResponse,
    Testimonial,
} from '@/types';

export async function fetchTestimonials(
    page = 1,
): Promise<ApiPaginatedResponse<Testimonial>> {
    const { data } = await apiClient.get<ApiPaginatedResponse<Testimonial>>(
        '/testimonials',
        {
            params: { page },
        },
    );
    return data;
}

interface TestimonialDetailData {
    testimonial: Testimonial;
    related: Testimonial[];
}

export async function fetchTestimonialDetail(
    id: number | string,
): Promise<TestimonialDetailData> {
    const { data } = await apiClient.get<
        ApiSuccessResponse<TestimonialDetailData>
    >(`/testimonials/${id}`);
    return data.data;
}
