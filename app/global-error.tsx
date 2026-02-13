"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#EFFAFD", padding: "2rem", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <h2 style={{ color: "#A0006D", fontSize: "1.25rem" }}>Une erreur s&apos;est produite</h2>
          <p style={{ color: "#666", marginTop: "0.5rem", fontSize: "0.875rem" }}>
            {error.message || "Erreur inattendue."}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{ marginTop: "1.5rem", padding: "0.5rem 1rem", background: "#4A8BDF", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.875rem" }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
