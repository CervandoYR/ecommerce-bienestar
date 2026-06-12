"use client";

import { motion } from "framer-motion";
import { Search, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-md"
      >
        {/* Animated 404 */}
        <motion.h1
          className="text-8xl font-bold gradient-text mb-4"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-warm-800 mb-3">
            Página no encontrada
          </h2>
          <p className="text-warm-500 mb-8 leading-relaxed">
            Lo sentimos, la página que buscas no existe o fue movida.
            Descubre nuestros productos de bienestar.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-sage-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Ir al Inicio
          </Link>
          <Link
            href="/productos"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-warm-700 rounded-lg font-medium hover:bg-warm-100 transition-colors"
          >
            <Search className="w-4 h-4" />
            Ver Productos
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
