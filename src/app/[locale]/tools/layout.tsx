import type { ReactNode } from "react";
import Script from "next/script";

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Script
        id="google-adsense"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8033378933696766"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </>
  );
}
