"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { loginWithGoogle } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    startTransition(async () => {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Error al iniciar sesión");
      } else {
        router.push("/perfil");
        router.refresh();
      }
    });
  };

  const handleGoogleLogin = async () => {
    setError("");
    startTransition(async () => {
      const res = await loginWithGoogle();
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-warm-900 mb-3 tracking-tight">Bienvenido de nuevo</h2>
        <p className="text-warm-500 font-light text-lg">
          Ingresa tus credenciales para acceder a tu santuario.
        </p>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium animate-pulse">
          {error}
        </div>
      )}

      <form onSubmit={handleEmailLogin} className="space-y-6">
        
        {/* Floating Label Input - Email */}
        <div className="relative">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer w-full h-14 border-b-2 border-warm-200 bg-transparent text-warm-900 placeholder-transparent focus:outline-none focus:border-sage-600 transition-colors"
            placeholder="tu@correo.com"
            required
          />
          <label 
            htmlFor="email"
            className="absolute left-0 -top-3.5 text-sm text-warm-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-sage-600 cursor-text"
          >
            Correo electrónico
          </label>
        </div>

        {/* Floating Label Input - Password */}
        <div className="relative">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="peer w-full h-14 border-b-2 border-warm-200 bg-transparent text-warm-900 placeholder-transparent focus:outline-none focus:border-sage-600 transition-colors"
            placeholder="••••••••"
            required
          />
          <label 
            htmlFor="password"
            className="absolute left-0 -top-3.5 text-sm text-warm-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-sage-600 cursor-text"
          >
            Contraseña
          </label>
          <div className="absolute right-0 top-4">
            <Link href="/recuperar" className="text-xs text-sage-600 hover:text-sage-800 font-medium transition-colors">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full h-14 text-base rounded-xl mt-4" disabled={isPending}>
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Iniciar sesión"}
        </Button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-warm-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-warm-400 font-light">O continúa con</span>
          </div>
        </div>

        <div className="mt-8">
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            className="w-full h-14 bg-transparent border-2 border-warm-200 text-warm-700 hover:bg-warm-50 hover:border-warm-300 rounded-xl flex items-center justify-center gap-3 transition-colors cursor-pointer"
            onClick={handleGoogleLogin}
            disabled={isPending}
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="font-semibold">Google</span>
          </motion.button>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-warm-100 flex justify-center">
        <p className="text-center text-warm-600 bg-warm-50/80 py-4 px-6 rounded-2xl w-full border border-warm-100">
          ¿No tienes una cuenta?{" "}
          <Link href="/registro" className="font-bold text-sage-700 hover:text-sage-800 underline decoration-sage-300 underline-offset-4">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
