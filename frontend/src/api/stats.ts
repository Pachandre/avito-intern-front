import type { TRequests, TResponses } from "../types";
import { API_BASE } from "./api";

const BASE = `${API_BASE}/stats`;

export function fetchSummary(
    req: TRequests["StatsSummary"]
): Promise<TResponses["StatsSummary"]> {
    const params = new URLSearchParams();
    if (req.period) params.set("period", req.period);
    if (req.startDate) params.set("startDate", req.startDate);
    if (req.endDate) params.set("endDate", req.endDate);

    const url = `${BASE}/summary?${params.toString()}`;

    const response = fetch(url);
    return response.then((res) => res.json());
}

export function fetchActivity(
    req: TRequests["StatsActivity"]
): Promise<TResponses["StatsActivity"]> {
    const params = new URLSearchParams();
    if (req.period) params.set("period", req.period);
    if (req.startDate) params.set("startDate", req.startDate);
    if (req.endDate) params.set("endDate", req.endDate);

    const url = `${BASE}/chart/activity?${params.toString()}`;

    const response = fetch(url);
    return response.then((res) => res.json());
}

export function fetchDecisions(
    req: TRequests["StatsDecisions"]
): Promise<TResponses["StatsDecisions"]> {
    const params = new URLSearchParams();
    if (req.period) params.set("period", req.period);
    if (req.startDate) params.set("startDate", req.startDate);
    if (req.endDate) params.set("endDate", req.endDate);

    const url = `${BASE}/chart/decisions?${params.toString()}`;

    const response = fetch(url);
    return response.then((res) => res.json());
}

export function fetchCategories(
    req: TRequests["StatsCategories"]
): Promise<TResponses["StatsCategories"]> {
    const params = new URLSearchParams();
    if (req.period) params.set("period", req.period);
    if (req.startDate) params.set("startDate", req.startDate);
    if (req.endDate) params.set("endDate", req.endDate);

    const url = `${BASE}/chart/categories?${params.toString()}`;
    const response = fetch(url);
    return response.then((res) => res.json());
}
