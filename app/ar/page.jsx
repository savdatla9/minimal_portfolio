'use client'

import dynamic from 'next/dynamic';

// Dynamically import the AR component to prevent server-side rendering errors with AR.js
const ARSceneARJS = dynamic(() => import('@/components/ARSceneARJS'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-t-2 border-[#00f3ff] rounded-full animate-spin"></div>
        <p className="text-sm font-semibold tracking-wide text-neutral-400">Loading AR Engine...</p>
      </div>
    </div>
  )
});

export default function ARPage() {
  return <ARSceneARJS />;
}
