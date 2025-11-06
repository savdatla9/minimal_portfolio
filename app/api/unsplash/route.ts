'use server'

import { NextResponse } from "next/server";
import { unsplashFetch } from "@/lib/unsplash";
import { unsplashConfig } from "@/lib/firebase";

export const runtime = "edge";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        // const query = searchParams.get("q") || "";
        
        const page = Number(searchParams.get("page") || 1);
        
        const perPage = Number(searchParams.get("perPage") || 12);
        
        // if (!query) return NextResponse.json({ error: "Search Params Missing" }, { status: 400 });

        const data = await unsplashFetch(`users/${unsplashConfig.user_name}/photos`, {
            // query,
            page,
            per_page: perPage,
            orientation: searchParams.get("orientation") || undefined,
            order_by: searchParams.get("orderBy") || undefined
        });

        return NextResponse.json(data, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
    };
};