"use client";

import dynamic from "next/dynamic";

const DesktopShell = dynamic(
  () =>
    import("@/components/desktop/DesktopShell").then((m) => m.DesktopShell),
  { ssr: false },
);

export default function HomePage() {
  return <DesktopShell />;
}
