"use client";

import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-600">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-gray-400">→</span>}
          {item.onClick != null ? (
            <button
              type="button"
              onClick={item.onClick}
              className="font-medium text-principal hover:underline focus:outline-none focus:ring-2 focus:ring-principal/30 rounded px-1 -mx-1"
            >
              {item.label}
            </button>
          ) : item.href != null ? (
            <Link
              href={item.href}
              className="font-medium text-principal hover:underline focus:outline-none focus:ring-2 focus:ring-principal/30 rounded px-1 -mx-1"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
