import apiClient from './client';
import type {
    ApiPaginatedResponse,
    ApiSuccessResponse,
    News,
    Category,
    SeoMeta,
} from '@/types';

interface NewsListResponse extends ApiPaginatedResponse<News> {
    categories: Category[];
}

interface NewsDetailData {
    news: News;
    seo_meta: SeoMeta | null;
    related: News[];
}

interface NewsCategoryResponse extends ApiPaginatedResponse<News> {
    category: Category;
}

export async function fetchNews(page = 1): Promise<NewsListResponse> {
    const { data } = await apiClient.get<NewsListResponse>('/news', {
        params: { page },
    });
    return data;
}

export async function fetchNewsDetail(slug: string): Promise<NewsDetailData> {
    const { data } = await apiClient.get<ApiSuccessResponse<NewsDetailData>>(
        `/news/${slug}`,
    );
    return data.data;
}

export async function fetchNewsByCategory(
    categorySlug: string,
    page = 1,
): Promise<NewsCategoryResponse> {
    const { data } = await apiClient.get<NewsCategoryResponse>(
        `/news/category/${categorySlug}`,
        {
            params: { page },
        },
    );
    return data;
}
