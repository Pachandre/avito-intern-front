import type { TRequests, TResponses } from "../types";
import { API_BASE } from "./api";

const BASE = `${API_BASE}/ads`;

export function fetchAds(
    req: TRequests["Ads"],
    signal?: AbortSignal
): Promise<TResponses["Ads"]> {
    const searchParams = new URLSearchParams();

    if (req.page) searchParams.set("page", req.page.toString());
    if (req.limit) searchParams.set("limit", req.limit.toString());
    if (req.status && req.status.length !== 0)
        req.status.forEach((s) => searchParams.append("status", s));
    if (req.categoryId)
        searchParams.set("categoryId", req.categoryId.toString());
    if (req.minPrice) searchParams.set("minPrice", req.minPrice.toString());
    if (req.maxPrice) searchParams.set("maxPrice", req.maxPrice.toString());
    if (req.search) searchParams.set("search", req.search);
    if (req.sortBy) searchParams.set("sortBy", req.sortBy);
    if (req.sortOrder) searchParams.set("sortOrder", req.sortOrder);

    const response = fetch(`${BASE}?${searchParams.toString()}`, {
        signal,
    });
    return response.then((res) => res.json());
}

export async function fetchAd(
    req: TRequests["Ad"],
    signal?: AbortSignal
): Promise<TResponses["Ad"]> {
    const response = fetch(`${BASE}/${req.id}`, { signal });
    return response.then((res) => res.json());
}

export function approveAd(
    req: TRequests["AdApprove"]
): Promise<TResponses["AdApprove"]> {
    const response = fetch(`${BASE}/${req.id}/approve`, {
        method: "POST",
    });
    return response.then((res) => res.json());
}

export function rejectAd(
    req: TRequests["AdReject"]
): Promise<TResponses["AdReject"]> {
    const body: Record<string, unknown> = {
        reason: req.reason,
    };
    if (req.comment !== undefined) body.comment = req.comment;

    const response = fetch(`${BASE}/${req.id}/reject`, {
        method: "POST",
        body: JSON.stringify(body),
    });
    return response.then((res) => res.json());
}
