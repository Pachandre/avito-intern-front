import type { TRequests, TResponses } from "../types";
import { API_BASE } from "./api";

const BASE = `${API_BASE}/stats`;

export function fetchSummary(
    req: TRequests["StatsSummary"]
): Promise<TResponses["StatsSummary"]> {
    const url = new URL(`${BASE}/summary`);
    if (req.period) url.searchParams.set("period", req.period);
    if (req.startDate) url.searchParams.set("startDate", req.startDate);
    if (req.endDate) url.searchParams.set("endDate", req.endDate);

    const response = fetch(url);
    return response.then((res) => res.json());
}

export function fetchActivity(
    req: TRequests["StatsActivity"]
): Promise<TResponses["StatsActivity"]> {
    const url = new URL(`${BASE}/chart/activity`);
    if (req.period) url.searchParams.set("period", req.period);
    if (req.startDate) url.searchParams.set("startDate", req.startDate);
    if (req.endDate) url.searchParams.set("endDate", req.endDate);

    const response = fetch(url);
    return response.then((res) => res.json());
}

export function fetchDecisions(
    req: TRequests["StatsDecisions"]
): Promise<TResponses["StatsDecisions"]> {
    const url = new URL(`${BASE}/chart/decisions`);
    if (req.period) url.searchParams.set("period", req.period);
    if (req.startDate) url.searchParams.set("startDate", req.startDate);
    if (req.endDate) url.searchParams.set("endDate", req.endDate);

    const response = fetch(url);
    return response.then((res) => res.json());
}

export function fetchCategories(
    req: TRequests["StatsCategories"]
): Promise<TResponses["StatsCategories"]> {
    const url = new URL(`${BASE}/chart/categories`);
    if (req.period) url.searchParams.set("period", req.period);
    if (req.startDate) url.searchParams.set("startDate", req.startDate);
    if (req.endDate) url.searchParams.set("endDate", req.endDate);

    const response = fetch(url);
    return response.then((res) => res.json());
}
