'use client';

import dynamic from 'next/dynamic';

// The interactive tool relies on browser-only WASM (@imgly/background-removal),
// so it is loaded client-side only. This wrapper lets a server component embed
// it while keeping the surrounding page content server-rendered and crawlable.
const MainTool = dynamic(() => import('./MainTool'), {
  ssr: false,
  loading: () => (
    <div className="tool-loading" style={{ minHeight: '260px' }} aria-hidden="true" />
  ),
});

export default function ToolLoader() {
  return <MainTool />;
}
