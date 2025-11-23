import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import {
    CSortKey,
    CSortOrder,
    CStatus,
    type TFilter,
    type TSort,
} from "../types";

function typedOrDefault<T extends readonly string[]>(
    val: string,
    opts: T,
    def: T[number]
): T[number] {
    return opts.includes(val) ? val : def;
}

export function useURLParams() {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters = useMemo((): TFilter => {
        const statusParam = searchParams.get("status");
        const statuses = statusParam ? statusParam.split(",") : [];
        const categoryIdParam = searchParams.get("categoryId");
        const priceFrom = searchParams.get("priceFrom");
        const priceTo = searchParams.get("priceTo");
        const mask = searchParams.get("search") || "";

        return {
            status: {
                pending: statuses.includes("pending"),
                approved: statuses.includes("approved"),
                rejected: statuses.includes("rejected"),
                draft: statuses.includes("draft"),
            },
            categoryId: categoryIdParam ? parseInt(categoryIdParam) : null,
            price: {
                from: priceFrom ? parseInt(priceFrom) : 0,
                to: priceTo ? parseInt(priceTo) : null,
            },
            mask,
        };
    }, [searchParams]);

    const sort = useMemo((): TSort => {
        const sortKeyRaw = searchParams.get("sortKey") ?? "";
        const sortOrderRaw = searchParams.get("sortOrder") ?? "";
        const sortKey = typedOrDefault(sortKeyRaw, CSortKey, "createdAt");
        const sortOrder = typedOrDefault(sortOrderRaw, CSortOrder, "asc");
        return { key: sortKey, order: sortOrder };
    }, [searchParams]);

    const page = useMemo((): number => {
        const pageParam = searchParams.get("page");
        return pageParam ? parseInt(pageParam) : 1;
    }, [searchParams]);

    const setFilters = useCallback(
        (action: React.SetStateAction<TFilter>) => {
            setSearchParams(
                (currentParams) => {
                    const current = new URLSearchParams(currentParams);

                    const statusParam = current.get("status");
                    const currentStatuses = statusParam
                        ? statusParam.split(",")
                        : [];
                    const currentFilters: TFilter = {
                        status: {
                            pending: currentStatuses.includes("pending"),
                            approved: currentStatuses.includes("approved"),
                            rejected: currentStatuses.includes("rejected"),
                            draft: currentStatuses.includes("draft"),
                        },
                        categoryId: current.get("categoryId")
                            ? parseInt(current.get("categoryId")!)
                            : null,
                        price: {
                            from: current.get("priceFrom")
                                ? parseInt(current.get("priceFrom")!)
                                : 0,
                            to: current.get("priceTo")
                                ? parseInt(current.get("priceTo")!)
                                : null,
                        },
                        mask: current.get("search") || "",
                    };

                    const newFilters =
                        typeof action === "function"
                            ? action(currentFilters)
                            : action;
                    const params = new URLSearchParams(current);

                    const activeStatuses = CStatus.filter(
                        (status) => newFilters.status[status]
                    );
                    if (activeStatuses.length > 0) {
                        params.set("status", activeStatuses.join(","));
                    } else {
                        params.delete("status");
                    }

                    if (newFilters.categoryId !== null) {
                        params.set(
                            "categoryId",
                            newFilters.categoryId.toString()
                        );
                    } else {
                        params.delete("categoryId");
                    }

                    if (newFilters.price.from > 0) {
                        params.set(
                            "priceFrom",
                            newFilters.price.from.toString()
                        );
                    } else {
                        params.delete("priceFrom");
                    }

                    if (newFilters.price.to !== null) {
                        params.set("priceTo", newFilters.price.to.toString());
                    } else {
                        params.delete("priceTo");
                    }

                    if (newFilters.mask) {
                        params.set("search", newFilters.mask);
                    } else {
                        params.delete("search");
                    }

                    return params;
                },
                { replace: true }
            );
        },
        [setSearchParams]
    );

    const setSort = useCallback(
        (newSort: TSort) => {
            setSearchParams(
                (current) => {
                    const params = new URLSearchParams(current);
                    params.set("sortKey", newSort.key);
                    params.set("sortOrder", newSort.order);
                    return params;
                },
                { replace: true }
            );
        },
        [setSearchParams]
    );

    const setPage = useCallback(
        (newPage: number) => {
            setSearchParams(
                (current) => {
                    const params = new URLSearchParams(current);
                    if (newPage > 1) {
                        params.set("page", newPage.toString());
                    } else {
                        params.delete("page");
                    }
                    return params;
                },
                { replace: true }
            );
        },
        [setSearchParams]
    );

    const resetFilters = useCallback(() => {
        setSearchParams(new URLSearchParams(), { replace: true });
    }, [setSearchParams]);

    return { filters, setFilters, resetFilters, sort, setSort, page, setPage };
}
