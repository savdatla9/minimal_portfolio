"use client";

import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  // const [state, action, pending] = useActionState(loginAction, { ok: false, message: "" });

  return (
    <main className="flex flex-col justify-center items-center">
      <div className="w-full max-w-md rounded-2xl border border-b-4 mt-[5vh] p-8 shadow">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm">Sign in to continue</p>

        {/* {state?.message && !pending && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {state.message}
          </div>
        )} */}

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 outline-none focus:border-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute inset-y-0 right-2 grid place-items-center px-2 text-sm text-gray-500"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="size-4 rounded border-gray-300" />
              Remember me
            </label>
            <a href="#" className="text-sm underline underline-offset-4">
              Forgot password?
            </a>
          </div>

          <button
            // disabled={pending}
            className="w-full rounded-lg px-4 py-2 font-medium border-2 disabled:opacity-60"
          >
            Sign In
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          New here?{" "}
          <a href="#" className="font-medium underline underline-offset-4">
            Create an account
          </a>
        </p>
      </div>
    </main>
  );
};