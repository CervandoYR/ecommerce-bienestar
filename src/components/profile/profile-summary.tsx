"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Gift, Calendar, Heart, Package, MapPin, Award, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { updateUserProfile } from "@/app/actions/profile";
import { cn } from "@/lib/utils";

interface ProfileSummaryProps {
  user: any;
  ordersCount: number;
  addressesCount: number;
  onTabSelect: (tabId: string) => void;
  onUpdate?: () => void;
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function ProfileSummary({ user, ordersCount, addressesCount, onTabSelect, onUpdate }: ProfileSummaryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [birthDateInput, setBirthDateInput] = useState(user.birthDate ? new Date(user.birthDate).toISOString().split("T")[0] : "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const birthDateObj = user.birthDate ? new Date(user.birthDate) : null;
  const birthMonthName = birthDateObj ? MONTH_NAMES[birthDateObj.getUTCMonth()] : null;
  const birthDay = birthDateObj ? birthDateObj.getUTCDate() : null;

  const handleSaveBirthDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDateInput) return;

    setIsSubmitting(true);
    const res = await updateUserProfile(user.id, {
      name: user.name || "Usuario",
      phone: user.phone || undefined,
      birthDate: birthDateInput
    });
    setIsSubmitting(false);

    if (res.success) {
      addToast({ type: "success", title: "Fecha registrada", description: "Tus beneficios de cumpleaños se han activado." });
      setIsModalOpen(false);
      if (onUpdate) onUpdate();
    } else {
      addToast({ type: "error", title: "Error", description: "No se pudo actualizar tu fecha de nacimiento." });
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Warm Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2C402E] via-[#2C402E] to-[#1e2c1f] p-8 md:p-10 text-white shadow-xl border border-gold-500/20"
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-sage-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
            <span>Santuario de Calma & Serenidad</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold font-serif tracking-tight leading-tight text-white">
            Hola {user.name || "invitado"}, bienvenido a tu espacio de calma.
          </h2>

          <p className="text-sage-100/90 text-sm md:text-base font-light leading-relaxed">
            Aquí podrás gestionar tus rituales de relajación, seguir el camino de tus pedidos en tiempo real y disfrutar de los privilegios exclusivos que tenemos reservados para ti.
          </p>
        </div>
      </motion.div>

      {/* Birthday Loyalty VIP Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gold-50/90 via-white to-warm-50 p-8 border-2 border-gold-400/60 shadow-md"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-gold-500/25">
              <Gift className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gold-800 uppercase tracking-wider bg-gold-100 px-2.5 py-0.5 rounded-md border border-gold-300/50">
                  Beneficio VIP Club
                </span>
                {birthDateObj && (
                  <span className="text-xs font-semibold text-sage-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sage-600" />
                    Registrado
                  </span>
                )}
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-warm-900 font-serif">
                {birthDateObj 
                  ? `Tu Mes de Cumpleaños: ${birthDay} de ${birthMonthName}` 
                  : "Regístrate en el Club de Cumpleaños"}
              </h3>

              <p className="text-warm-700 text-sm leading-relaxed">
                {birthDateObj
                  ? "Agradecemos infinitamente tu preferencia. Te recordamos que durante tu mes de cumpleaños se activarán descuentos exclusivos u obsequios especiales en tus compras."
                  : "Queremos celebrarte como mereces. Agrega tu fecha de nacimiento para recibir descuentos exclusivos u obsequios en tu mes de cumpleaños."}
              </p>
            </div>
          </div>

          <div className="shrink-0 self-start md:self-center">
            {!birthDateObj ? (
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gold-600 hover:bg-gold-700 text-white font-bold px-6 h-12 shadow-lg shadow-gold-600/20 hover:scale-105 transition-all"
              >
                <span>Registrar mi Cumpleaños</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Button>
            ) : (
              <div className="text-center px-6 py-3 bg-white rounded-2xl border border-gold-200/80 shadow-xs">
                <span className="text-[11px] uppercase font-bold text-warm-400 block">Estatus VIP</span>
                <span className="text-sm font-bold text-gold-700 font-serif">Activo & Garantizado</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick Dashboard Stats / Shortcuts */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div
          onClick={() => onTabSelect("pedidos")}
          className="bg-white rounded-3xl p-6 border border-warm-200/80 shadow-sm hover:shadow-md hover:border-sage-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-sage-50 text-sage-700 flex items-center justify-center group-hover:bg-sage-700 group-hover:text-white transition-colors">
              <Package className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-warm-900 font-serif">{ordersCount}</span>
          </div>
          <div>
            <h4 className="font-bold text-warm-900 text-base font-serif group-hover:text-sage-700 transition-colors flex items-center justify-between">
              <span>Mis Pedidos</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-sage-700" />
            </h4>
            <p className="text-xs text-warm-500 mt-0.5">Revisa el estado y seguimiento de compras</p>
          </div>
        </div>

        <div
          onClick={() => onTabSelect("direcciones")}
          className="bg-white rounded-3xl p-6 border border-warm-200/80 shadow-sm hover:shadow-md hover:border-sage-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center group-hover:bg-gold-600 group-hover:text-white transition-colors">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-warm-900 font-serif">{addressesCount}</span>
          </div>
          <div>
            <h4 className="font-bold text-warm-900 text-base font-serif group-hover:text-gold-700 transition-colors flex items-center justify-between">
              <span>Mis Direcciones</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-gold-700" />
            </h4>
            <p className="text-xs text-warm-500 mt-0.5">Domicios de entrega para despachos</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-warm-50/80 rounded-3xl p-6 border border-warm-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-sage-100/80 text-sage-800 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold bg-sage-200/60 text-sage-900 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Nivel Oro
            </span>
          </div>
          <div>
            <h4 className="font-bold text-warm-900 text-base font-serif">Garantía Samay Munay</h4>
            <p className="text-xs text-warm-500 mt-0.5 flex items-center gap-1.5 pt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sage-600 shrink-0" />
              <span>Compras protegidas & curaduría 100% pura</span>
            </p>
          </div>
        </div>
      </div>

      {/* Birthday Registration Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Activar Beneficios VIP de Cumpleaños"
        size="sm"
      >
        <form onSubmit={handleSaveBirthDate} className="space-y-4 pt-2">
          <p className="text-sm text-warm-600">
            Por favor ingresa tu fecha de nacimiento real para poder enviarte obsequios de aromaterapia y beneficios personalizados en tu día especial.
          </p>

          <div>
            <label className="block text-xs font-bold text-warm-700 uppercase tracking-wider mb-1.5">
              Fecha de Nacimiento *
            </label>
            <Input
              type="date"
              required
              value={birthDateInput}
              onChange={(e) => setBirthDateInput(e.target.value)}
              className="h-11 rounded-xl bg-white text-base"
            />
          </div>

          <div className="pt-4 border-t border-warm-100 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="h-11 text-warm-600"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gold-600 hover:bg-gold-700 text-white h-11 px-6 shadow-md"
            >
              {isSubmitting ? "Guardando..." : "Activar Beneficios"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
