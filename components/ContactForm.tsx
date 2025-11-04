"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function ContactForm() {
    const [state, setState] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
        "idle"
    );

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");

        try {
            await addDoc(collection(db, "messages"), {
                ...state,
                createdAt: serverTimestamp(),
            });

            setStatus("sent");
            setState({ name: "", email: "", message: "" });
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    }

    return (
        <form onSubmit={onSubmit} className="max-w-xl space-y-4">
            <div className="grid gap-2">
                <label className="text-sm opacity-75">Name</label>
                <input
                    required
                    value={state.name}
                    onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
                    className="w-full rounded-xl border bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/40"
                    placeholder="Your name"
                />
            </div>

            <div className="grid gap-2">
                <label className="text-sm opacity-75">Email</label>
                <input
                    required
                    type="email"
                    value={state.email}
                    onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
                    className="w-full rounded-xl border bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/40"
                    placeholder="you@example.com"
                />
            </div>

            <div className="grid gap-2">
                <label className="text-sm opacity-75">Message</label>
                <textarea
                    required
                    rows={5}
                    value={state.message}
                    onChange={(e) =>
                        setState((s) => ({ ...s, message: e.target.value }))
                    }
                    className="w-full rounded-xl border bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/40"
                    placeholder="Say hello…"
                />
            </div>

            <button
                disabled={status === "loading"}
                className="rounded-xl border px-4 py-2 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
                {status === "loading" ? "Sending…" : "Send"}
            </button>

            {status === "sent" && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    Thanks! I’ll get back to you soon.
                </p>
            )}

            {status === "error" && (
                <p className="text-sm text-red-600 dark:text-red-400">
                    Something went wrong. Please try again.
                </p>
            )}
        </form>
    );
}