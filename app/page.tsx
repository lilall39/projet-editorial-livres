"use client";

import { Suspense } from "react";
import { PlanningContent } from "@/components/PlanningContent";

export default function PlanningPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-fond">
        <p className="text-gray-500">Chargement…</p>
      </div>
    }>
      <PlanningContent />
    </Suspense>
  );
}
