import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-fond p-8">
      <h1 className="text-xl font-semibold text-principal">Page introuvable</h1>
      <p className="mt-2 text-sm text-gray-600">La page demandée n’existe pas.</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-principal px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        Retour au planning
      </Link>
    </div>
  );
}
