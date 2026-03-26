import apiClient from './client';
import type { ApiSuccessResponse, Partner } from '@/types';

interface PartnersData {
    partners: Partner[];
    categories: string[];
}

export async function fetchPartners(): Promise<PartnersData> {
    const { data } =
        await apiClient.get<ApiSuccessResponse<PartnersData>>('/partners');
    return data.data;
}

export async function fetchAllPartners(): Promise<PartnersData> {
    const { data } =
        await apiClient.get<ApiSuccessResponse<PartnersData>>('/partners/all');
    return data.data;
}

interface PartnerDetailData {
    partner: Partner;
    related: Partner[];
}

export async function fetchPartnerDetail(
    id: number | string,
): Promise<PartnerDetailData> {
    const { data } = await apiClient.get<ApiSuccessResponse<PartnerDetailData>>(
        `/partners/${id}`,
    );
    return data.data;
}
