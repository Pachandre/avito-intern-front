import { useQuery } from "@tanstack/react-query";
import { fetchAds } from "../api/ads";

export function useCategories() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await fetchAds({ limit: 100 });
            const uniqueCategories = new Map<number, string>();

            response.ads.forEach((ad) => {
                if (ad.categoryId && ad.category) {
                    uniqueCategories.set(ad.categoryId, ad.category);
                }
            });

            return Array.from(uniqueCategories, ([id, name]) => ({
                id,
                name,
            })).sort((a, b) => a.name.localeCompare(b.name));
        },
        initialData: [],
        staleTime: 10 * 60 * 1000,
    });

    return {
        categories: data || [],
        loading: isLoading,
        error,
    };
}
