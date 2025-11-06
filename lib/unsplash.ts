import { unsplashConfig } from './firebase';

export async function unsplashFetch(path: string, params?: Record<string, string | number | undefined>) {
    const key = unsplashConfig.public_key;

    if (!key) throw new Error("Missing UNSPLASH_ACCESS_KEY");

    const url = new URL(`${unsplashConfig.url}${path}`);
    if (params) {
        Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
        });
    }

    const res = await fetch(url.toString(), {
        headers: { Authorization: `Client-ID ${key}` },
        // Helpful cache for public GETs; adjust per your needs:
        next: { revalidate: 60 }
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Unsplash ${res.status}: ${text}`);
    }

    return res.json();
}