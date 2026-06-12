"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>

        <h2 className="text-2xl font-semibold text-warm-800 mb-3">
          Algo salió mal
        </h2>
        <p className="text-warm-500 mb-8 leading-relaxed">
          Ocurrió un error inesperado. Por favor, inténtalo de nuevo o regresa al inicio.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-sage-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-warm-700 rounded-lg font-medium hover:bg-warm-100 transition-colors"
          >
            <Home className="w-4 h-4" />
            Ir al Inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
