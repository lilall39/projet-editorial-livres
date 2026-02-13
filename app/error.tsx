"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-fond p-8">
      <h2 className="text-lg font-semibold text-alerte">Une erreur s&apos;est produite</h2>
      <p className="mt-2 max-w-md text-center text-sm text-gray-600">
        {error.message || "Erreur inattendue."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg bg-principal px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        Réessayer
      </button>
    </div>
  );
}
