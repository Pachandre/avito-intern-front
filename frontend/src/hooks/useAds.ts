import { useQuery } from "@tanstack/react-query";
import { fetchAds } from "../api/ads";
import { type TFilter, type TSort, getActiveStatuses } from "../types";

export function useAds(
    filters: TFilter,
    sort: TSort,
    page: number,
    limit: number
) {
    return useQuery({
        queryKey: ["ads", filters, sort, page, limit],
        queryFn: ({ signal }) => {
            return fetchAds(
                {
                    page,
                    limit,
                    status: getActiveStatuses(filters.status),
                    categoryId: filters.categoryId ?? undefined,
                    minPrice:
                        filters.price.from > 0 ? filters.price.from : undefined,
                    maxPrice: filters.price.to || undefined,
                    search: filters.mask || undefined,
                    sortBy: sort.key,
                    sortOrder: sort.order,
                },
                signal
            );
        },
        keepPreviousData: true,
    });
}
