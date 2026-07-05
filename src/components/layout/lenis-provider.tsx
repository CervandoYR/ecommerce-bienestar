"use client";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  // Desactivado Lenis para permitir scroll nativo del navegador sin resistencia ni fricción
  return <>{children}</>;
}

