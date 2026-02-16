import { Suspense } from "react";
import { BuilderPageClient } from "./builder-page-client";

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <BuilderPageClient />
    </Suspense>
  );
}
