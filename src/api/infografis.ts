import apiClient from './client';
import type { ApiSuccessResponse } from '@/types';

export interface InfoGrafisStats {
    total_news: number;
    total_events: number;
    total_pages: number;
    total_partners: number;
    total_testimonials: number;
}

export interface MonthlyData {
    month: string;
    count: number;
}

export interface DistributionData {
    name: string;
    value: number;
}

export interface InfoGrafisData {
    stats: InfoGrafisStats;
    monthlyNews: MonthlyData[];
    monthlyEvents: MonthlyData[];
    contentDistribution: DistributionData[];
}

export async function fetchInfoGrafis(): Promise<InfoGrafisData> {
    const { data } =
        await apiClient.get<ApiSuccessResponse<InfoGrafisData>>('/info-grafis');
    return data.data;
}
