/* -------------------------------------------------------------------------- */
/*                                Helper types                                */

import type React from "react";

/* -------------------------------------------------------------------------- */
export type ChildrenProps = { children?: React.ReactNode };
export type StatePair<T> = [T, React.Dispatch<React.SetStateAction<T>>];

/* -------------------------------------------------------------------------- */
/*                               Primitive types                              */
/* -------------------------------------------------------------------------- */
export type integer = number;
export type TDateTimeString = string;
export type TDateString = string;

/* -------------------------------------------------------------------------- */
/*                             Enums and Constants                            */
/* -------------------------------------------------------------------------- */
export const CTheme = ["dark", "light"] as const;
export type TTheme = (typeof CTheme)[number];
export const CStatus = ["pending", "approved", "rejected", "draft"] as const;
export type TStatus = (typeof CStatus)[number];

export const CStatusLabels: { [key in TStatus]: string } = {
    approved: "Одобрено",
    pending: "На модерации",
    rejected: "Отклонено",
    draft: "На доработке",
};

export const CPriority = ["normal", "urgent"] as const;
export type TPriority = (typeof CPriority)[number];

export const CAction = ["approved", "rejected", "requestChanges"] as const;
export type TAction = (typeof CAction)[number];
export const CActionLabels: { [key in TAction]: string } = {
    approved: "Одобрено",
    rejected: "Отклонено",
    requestChanges: "Отправлено на доработку",
};

export const CReason = [
    "Запрещенный товар",
    "Неверная категория",
    "Некорректное описание",
    "Проблемы с фото",
    "Подозрение на мошенничество",
    "Другое",
] as const;
export type TReason = (typeof CReason)[number];

export const CPeriod = ["today", "week", "month", "custom"] as const;
export type TPeriod = (typeof CPeriod)[number];
export const CPeriodLabels: Record<TPeriod, string> = {
    today: "Сегодня",
    week: "Неделя",
    month: "Месяц",
    custom: "Указать",
};

export const CSortOrder = ["asc", "desc"] as const;
export type TSortOrder = (typeof CSortOrder)[number];

export const CSortKey = ["createdAt", "price", "priority"] as const;
export type TSortKey = (typeof CSortKey)[number];
export const CSortKeyLabels: Record<TSortKey, string> = {
    createdAt: "по дате",
    price: "по цене",
    priority: "по приоритету",
};

/* -------------------------------------------------------------------------- */
/*                                Domain models                               */
/* -------------------------------------------------------------------------- */
export type TSeller = {
    id: integer;
    name: string;
    rating: string;
    totalAds: integer;
    registeredAt: TDateTimeString;
};

export type TModerationHistory = {
    id: integer;
    moderatorId: integer;
    moderatorName: string;
    action: TAction;
    reason: string | null;
    comment: string;
    timestamp: TDateTimeString;
};

export type TAdvertisement = {
    id: integer;
    title: string;
    description: string;
    price: number;
    category: string;
    categoryId: integer;
    status: TStatus;
    priority: TPriority;
    createdAt: TDateTimeString;
    updatedAt: TDateTimeString;
    images: string[];
    seller: TSeller;
    characteristics: Record<string, string>;
    moderationHistory: TModerationHistory[];
};

export type TModeratorStats = {
    totalReviewed: integer;
    todayReviewed: integer;
    thisWeekReviewed: integer;
    thisMonthReviewed: integer;
    averageReviewTime: integer;
    approvalRate: number;
};

export type TModerator = {
    id: integer;
    name: string;
    email: string;
    role: string;
    statistics: TModeratorStats;
    permissions: string[];
};

export type TPagination = {
    currentPage: integer;
    totalPages: integer;
    totalItems: integer;
    itemsPerPage: integer;
};

export type TStatsSummary = {
    totalReviewed: integer;
    totalReviewedToday: integer;
    totalReviewedThisWeek: integer;
    totalReviewedThisMonth: integer;
    approvedPercentage: number;
    rejectedPercentage: number;
    requestChangesPercentage: number;
    averageReviewTime: integer;
};

export type TActivityData = {
    date: TDateString;
    approved: integer;
    rejected: integer;
    requestChanges: integer;
};

export type TDecisionsData = {
    approved: number;
    rejected: number;
    requestChanges: number;
};

/* -------------------------------------------------------------------------- */
/*                             Filters and Sorting                            */
/* -------------------------------------------------------------------------- */
export type TStatusFilter = { [key in TStatus]: boolean };

export type TFilter = {
    status: TStatusFilter;
    categoryId: number | null;
    price: {
        from: number;
        to: number | null;
    };
    mask: string;
};

export function getActiveStatuses(status: TStatusFilter): TStatus[] {
    return CStatus.filter((v) => status[v]);
}

export type TSort = {
    key: TSortKey;
    order: TSortOrder;
};

/* -------------------------------------------------------------------------- */
/*                         API Request/Response types                         */
/* -------------------------------------------------------------------------- */
export type TAdsRequest = {
    page?: integer;
    limit?: integer;
    status?: TStatus[];
    categoryId?: integer;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: TSortKey;
    sortOrder?: TSortOrder;
};

export type TAdsResponse = {
    ads: TAdvertisement[];
    pagination: TPagination;
};

export type TAdRequest = {
    id: integer;
};

export type TAdResponse = TAdvertisement;

export type TAdApproveRequest = {
    id: integer;
};

export type TAdApproveResponse = {
    message: string;
    ad: TAdvertisement;
};

export type TAdRejectRequest = {
    id: integer;
    reason: TReason | string;
    comment?: string;
};

export type TAdRejectResponse = {
    message: string;
    ad: TAdvertisement;
};

export type TAdChangesRequest = {
    id: integer;
    reason: TReason | string;
    comment?: string;
};

export type TAdChangesResponse = {
    message: string;
    ad: TAdvertisement;
};

export type TStatsSummaryRequest = {
    period?: TPeriod;
    startDate?: TDateString;
    endDate?: TDateString;
};

export type TStatsSummaryResponse = TStatsSummary;

export type TStatsActivityRequest = {
    period?: TPeriod;
    startDate?: TDateString;
    endDate?: TDateString;
};

export type TStatsActivityResponse = TActivityData[];

export type TStatsDecisionsRequest = {
    period?: TPeriod;
    startDate?: TDateString;
    endDate?: TDateString;
};

export type TStatsDecisionsResponse = TDecisionsData;

export type TStatsCategoriesRequest = {
    period?: TPeriod;
    startDate?: TDateString;
    endDate?: TDateString;
};

export type TStatsCategoriesResponse = Record<string, integer>;

export type TModeratorMeResponse = TModerator;

/* -------------------------------------------------------------------------- */
/*                              API endpoints map                             */
/* -------------------------------------------------------------------------- */
export type TRequests = {
    Ads: TAdsRequest;
    Ad: TAdRequest;
    AdApprove: TAdApproveRequest;
    AdReject: TAdRejectRequest;
    AdChanges: TAdChangesRequest;
    StatsSummary: TStatsSummaryRequest;
    StatsActivity: TStatsActivityRequest;
    StatsDecisions: TStatsDecisionsRequest;
    StatsCategories: TStatsCategoriesRequest;
    ModeratorMe: never;
};

export type TResponses = {
    Ads: TAdsResponse;
    Ad: TAdResponse;
    AdApprove: TAdApproveResponse;
    AdReject: TAdRejectResponse;
    AdChanges: TAdChangesResponse;
    StatsSummary: TStatsSummaryResponse;
    StatsActivity: TStatsActivityResponse;
    StatsDecisions: TStatsDecisionsResponse;
    StatsCategories: TStatsCategoriesResponse;
    ModeratorMe: TModeratorMeResponse;
};
