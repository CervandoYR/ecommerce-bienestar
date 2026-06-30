"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { User, LogOut, Package, Heart, Settings } from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="bg-warm-50 min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sage-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="bg-warm-50 min-h-screen py-10 lg:py-16">
      <div className="container-narrow">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-warm-900 mb-4">
            Mi Perfil
          </h1>
          <p className="text-warm-500 max-w-2xl">
            Gestiona tus datos personales, pedidos y preferencias.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar Menu */}
          <aside className="lg:col-span-1 bg-white p-6 rounded-2xl border border-warm-200 shadow-sm sticky top-28">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center text-sage-600 mb-4">
                <User className="w-10 h-10" />
              </div>
              <h2 className="text-lg font-bold text-warm-900 text-center">
                {user.user_metadata?.name || user.user_metadata?.full_name || "Usuario de Bienestar"}
              </h2>
              <p className="text-sm text-warm-500 truncate w-full text-center">
                {user.email}
              </p>
            </div>

            <nav className="space-y-2">
              <Button variant="secondary" className="w-full justify-start font-medium bg-sage-50 text-sage-700">
                <User className="w-5 h-5 mr-3" />
                Mis Datos
              </Button>
              <Button variant="ghost" className="w-full justify-start text-warm-600 font-medium">
                <Package className="w-5 h-5 mr-3" />
                Mis Pedidos
              </Button>
              <Button variant="ghost" className="w-full justify-start text-warm-600 font-medium">
                <Heart className="w-5 h-5 mr-3" />
                Favoritos
              </Button>
              <Button variant="ghost" className="w-full justify-start text-warm-600 font-medium">
                <Settings className="w-5 h-5 mr-3" />
                Ajustes
              </Button>
              <div className="pt-4 mt-4 border-t border-warm-100">
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 font-medium"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Cerrar Sesión
                </Button>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-warm-200">
              <h3 className="text-xl font-semibold text-warm-900 mb-6">Información Personal</h3>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-warm-500 mb-1">Nombre</label>
                  <p className="text-warm-900 font-medium bg-warm-50 p-3 rounded-lg border border-warm-100">
                    {user.user_metadata?.name || user.user_metadata?.full_name || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-500 mb-1">Correo Electrónico</label>
                  <p className="text-warm-900 font-medium bg-warm-50 p-3 rounded-lg border border-warm-100">
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-500 mb-1">Teléfono</label>
                  <p className="text-warm-900 font-medium bg-warm-50 p-3 rounded-lg border border-warm-100">
                    {user.user_metadata?.phone || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-500 mb-1">Contraseña</label>
                  <p className="text-warm-900 font-medium bg-warm-50 p-3 rounded-lg border border-warm-100">
                    ********
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <Button>Editar Información</Button>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-warm-200">
              <h3 className="text-xl font-semibold text-warm-900 mb-6">Pedidos Recientes</h3>
              
              <div className="text-center py-10 bg-warm-50 rounded-xl border border-warm-100 border-dashed">
                <Package className="w-12 h-12 text-warm-300 mx-auto mb-3" />
                <p className="text-warm-600 font-medium mb-1">Aún no tienes pedidos</p>
                <p className="text-warm-500 text-sm">Tus futuras compras aparecerán aquí.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
