"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User as UserIcon, LogOut, Package, MapPin, Sparkles, Heart, 
  Settings, Crown, Shield, Bell, ChevronRight, Award 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { getUserDashboardData } from "@/app/actions/profile";
import { ProfileSummary } from "@/components/profile/profile-summary";
import { buildWhatsAppUrl } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { OrderHistory } from "@/components/profile/order-history";
import { AddressManager } from "@/components/profile/address-manager";
import ProfileEditor from "@/components/profile/profile-editor";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"resumen" | "pedidos" | "direcciones" | "perfil">("resumen");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  const fetchDashboard = useCallback(async () => {
    if (!user) return;
    if (!dashboardData) {
      setLoadingData(true);
    }
    const identifier = user.email || user.id;
    const res = await getUserDashboardData(identifier);
    if (res.success && res.user) {
      setDashboardData(res.user);
    } else {
      // Fallback with user metadata if db query fails or user is fresh
      setDashboardData({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Miembro de Bienestar",
        phone: user.user_metadata?.phone || null,
        birthDate: null,
        addresses: [],
        orders: [],
      });
    }
    setLoadingData(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      fetchDashboard();
    }
  }, [user, authLoading, router, fetchDashboard]);

  if (authLoading || !user || loadingData) {
    return (
      <div className="bg-[#FAF8F5] min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 border-4 border-[#2C402E] border-t-[#C5A059] rounded-full animate-spin shadow-md" />
        <p className="text-[#2C402E] font-serif text-lg font-medium animate-pulse">
          Preparando tu Santuario VIP...
        </p>
      </div>
    );
  }

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const orders = dashboardData?.orders || [];
  const addresses = dashboardData?.addresses || [];
  const displayName = dashboardData?.name || user.user_metadata?.name || user.user_metadata?.full_name || "Miembro de Bienestar";

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 lg:py-16 selection:bg-[#C5A059]/20 selection:text-[#2C402E]">
      <div className="container-wide px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* VIP Top Bar / Breadcrumb Header */}
        <div className="mb-8 md:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-warm-200/60">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-1">
              <Crown className="w-4 h-4 fill-[#C5A059]" />
              <span>Dashboard de Miembro VIP</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#2C402E] font-serif tracking-tight">
              Mi Espacio de Calma
            </h1>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="px-4 py-2 rounded-2xl bg-white border border-warm-200/80 shadow-xs flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#2C402E]">Club Serenidad Activo</span>
            </div>
          </div>
        </div>

        {/* Dashboard Architecture Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* VIP Sidebar Menu */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-6 lg:sticky lg:top-28">
            
            {/* Member Profile Card */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-warm-200/80 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#2C402E] to-sage-800 p-0.5 shadow-lg shadow-[#2C402E]/20">
                    <div className="w-full h-full bg-[#FAF8F5] rounded-[22px] flex items-center justify-center overflow-hidden">
                      {user.user_metadata?.avatar_url || dashboardData?.avatarUrl ? (
                        <Image
                          src={user.user_metadata?.avatar_url || dashboardData?.avatarUrl}
                          alt={displayName}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-black text-[#2C402E] font-serif">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#C5A059] text-white flex items-center justify-center shadow-md border-2 border-white">
                    <Sparkles className="w-4 h-4 fill-white" />
                  </div>
                </div>

                <h2 className="text-lg md:text-xl font-bold text-[#2C402E] font-serif leading-snug">
                  {displayName}
                </h2>
                <p className="text-xs text-warm-500 truncate w-full mt-0.5">
                  {user.email}
                </p>

                <div className="mt-4 pt-4 border-t border-warm-100 w-full grid grid-cols-2 gap-2 text-center">
                  <div className="bg-warm-50/80 p-2 rounded-xl border border-warm-100">
                    <span className="text-[10px] uppercase font-bold text-warm-400 block">Pedidos</span>
                    <span className="text-base font-black text-[#2C402E] font-serif">{orders.length}</span>
                  </div>
                  <div className="bg-warm-50/80 p-2 rounded-xl border border-warm-100">
                    <span className="text-[10px] uppercase font-bold text-warm-400 block">Direcciones</span>
                    <span className="text-base font-black text-[#C5A059] font-serif">{addresses.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Sidebar style) */}
            <nav className="bg-white p-3 rounded-3xl border border-warm-200/80 shadow-sm space-y-1.5">
              <button
                onClick={() => setActiveTab("resumen")}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 cursor-pointer",
                  activeTab === "resumen"
                    ? "bg-[#2C402E] text-white shadow-md shadow-[#2C402E]/20"
                    : "text-warm-600 hover:bg-warm-50 hover:text-[#2C402E]"
                )}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className={cn("w-5 h-5", activeTab === "resumen" ? "text-[#C5A059]" : "text-warm-400")} />
                  <span>Mi Santuario</span>
                </div>
                <ChevronRight className={cn("w-4 h-4 opacity-70", activeTab === "resumen" && "translate-x-0.5")} />
              </button>

              <button
                onClick={() => setActiveTab("pedidos")}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 cursor-pointer",
                  activeTab === "pedidos"
                    ? "bg-[#2C402E] text-white shadow-md shadow-[#2C402E]/20"
                    : "text-warm-600 hover:bg-warm-50 hover:text-[#2C402E]"
                )}
              >
                <div className="flex items-center gap-3">
                  <Package className={cn("w-5 h-5", activeTab === "pedidos" ? "text-[#C5A059]" : "text-warm-400")} />
                  <span>Mis Pedidos</span>
                </div>
                {orders.length > 0 && (
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-bold",
                    activeTab === "pedidos" ? "bg-[#C5A059] text-white" : "bg-warm-100 text-warm-700"
                  )}>
                    {orders.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("direcciones")}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 cursor-pointer",
                  activeTab === "direcciones"
                    ? "bg-[#2C402E] text-white shadow-md shadow-[#2C402E]/20"
                    : "text-warm-600 hover:bg-warm-50 hover:text-[#2C402E]"
                )}
              >
                <div className="flex items-center gap-3">
                  <MapPin className={cn("w-5 h-5", activeTab === "direcciones" ? "text-[#C5A059]" : "text-warm-400")} />
                  <span>Mis Direcciones</span>
                </div>
                {addresses.length > 0 && (
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-bold",
                    activeTab === "direcciones" ? "bg-[#C5A059] text-white" : "bg-warm-100 text-warm-700"
                  )}>
                    {addresses.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("perfil")}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 cursor-pointer",
                  activeTab === "perfil"
                    ? "bg-[#2C402E] text-white shadow-md shadow-[#2C402E]/20"
                    : "text-warm-600 hover:bg-warm-50 hover:text-[#2C402E]"
                )}
              >
                <div className="flex items-center gap-3">
                  <UserIcon className={cn("w-5 h-5", activeTab === "perfil" ? "text-[#C5A059]" : "text-warm-400")} />
                  <span>Mis Datos VIP</span>
                </div>
                <ChevronRight className={cn("w-4 h-4 opacity-70", activeTab === "perfil" && "translate-x-0.5")} />
              </button>

              <div className="pt-2 mt-2 border-t border-warm-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <LogOut className="w-5 h-5 text-red-400" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </nav>

            {/* Assistance Card */}
            <div className="bg-gradient-to-br from-gold-50 to-warm-50 p-6 rounded-3xl border border-gold-200/60 shadow-xs text-center space-y-3 hidden sm:block">
              <Award className="w-8 h-8 text-[#C5A059] mx-auto" />
              <h4 className="font-bold text-[#2C402E] font-serif text-sm">¿Necesitas ayuda personalizada?</h4>
              <p className="text-xs text-warm-600 leading-relaxed">
                Nuestras terapeutas están disponibles por WhatsApp para asesorarte en tu ritual ideal.
              </p>
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="w-full bg-white text-[#2C402E] hover:bg-white/80 border border-gold-300/80 font-bold shadow-xs text-xs h-9"
              >
                <a
                  href={buildWhatsAppUrl(WHATSAPP_NUMBER, `Hola Samay Munay, soy ${displayName} y quisiera consultarte sobre mis pedidos/cuenta.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contactar Asesora VIP
                </a>
              </Button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-8 xl:col-span-9">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white/90 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-3xl border border-warm-200/80 shadow-sm hover:border-[#C5A059]/40 transition-all duration-500"
            >
              {activeTab === "resumen" && (
                <ProfileSummary
                  user={dashboardData || user}
                  ordersCount={orders.length}
                  addressesCount={addresses.length}
                  onTabSelect={(tabId) => setActiveTab(tabId as any)}
                  onUpdate={fetchDashboard}
                />
              )}

              {activeTab === "pedidos" && (
                <OrderHistory orders={orders} />
              )}

              {activeTab === "direcciones" && (
                <AddressManager
                  userId={dashboardData?.id || user.id}
                  initialAddresses={addresses}
                  onUpdate={fetchDashboard}
                />
              )}

              {activeTab === "perfil" && (
                <ProfileEditor
                  user={user}
                  dashboardData={dashboardData}
                  onUpdate={fetchDashboard}
                />
              )}
            </motion.div>
          </main>

        </div>
      </div>
    </div>
  );
}
