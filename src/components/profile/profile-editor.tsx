"use client";

import { useState } from "react";
import { updateUserProfile } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { 
  User, Phone, FileText, Calendar, Mail, ShieldCheck, 
  Sparkles, CheckCircle2, Lock, Save 
} from "lucide-react";

interface ProfileEditorProps {
  user: any;
  dashboardData: any;
  onUpdate: () => void;
}

export default function ProfileEditor({ user, dashboardData, onUpdate }: ProfileEditorProps) {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format initial birthdate if exists
  const initialBirthDate = dashboardData?.birthDate
    ? new Date(dashboardData.birthDate).toISOString().split("T")[0]
    : "";

  const [formData, setFormData] = useState({
    name: dashboardData?.name || user?.user_metadata?.name || user?.user_metadata?.full_name || "",
    phone: dashboardData?.phone || user?.user_metadata?.phone || "",
    documentId: dashboardData?.documentId || "",
    birthDate: initialBirthDate,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast({
        type: "error",
        title: "Nombre requerido",
        description: "Por favor ingresa tu nombre completo.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await updateUserProfile(dashboardData?.id || user.id, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        documentId: formData.documentId.trim(),
        birthDate: formData.birthDate || undefined,
      });

      if (res.success) {
        addToast({
          type: "success",
          title: "¡Perfil VIP Actualizado!",
          description: "Tus datos personales se han guardado correctamente en tu cuenta.",
        });
        onUpdate();
      } else {
        throw new Error(res.error || "No se pudieron guardar los cambios.");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      addToast({
        type: "error",
        title: "Error al actualizar",
        description: error.message || "Ocurrió un problema al guardar tus datos.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      
      {/* Header */}
      <div className="border-b border-warm-200/80 pb-5 flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5 fill-[#C5A059]" />
            <span>Configuración de Cuenta</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#2C402E] font-serif">
            Mis Datos Personales
          </h2>
          <p className="text-warm-600 text-sm mt-1">
            Administra tu información personal, contacto para envíos y beneficios de cumpleaños.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-200 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Cuenta VIP Verificada</span>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-warm-200/80 space-y-6">
        
        <div className="grid sm:grid-cols-2 gap-6">
          
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2C402E] uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-[#C5A059]" />
              <span>Nombre y Apellidos *</span>
            </label>
            <Input
              required
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ej. María García Robles"
              className="h-12 rounded-xl bg-warm-50/50 font-medium text-[#2C402E] focus:bg-white transition-colors"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2C402E] uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C5A059]" />
              <span>Teléfono / Celular (WhatsApp) *</span>
            </label>
            <Input
              required
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Ej. 999 888 777"
              className="h-12 rounded-xl bg-warm-50/50 font-medium text-[#2C402E] focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 pt-2">
          
          {/* Document ID */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2C402E] uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C5A059]" />
              <span>DNI / RUC (Para Boleta o Factura)</span>
            </label>
            <Input
              name="documentId"
              value={formData.documentId}
              onChange={handleInputChange}
              placeholder="Ej. 76543210 o 20123456789"
              className="h-12 rounded-xl bg-warm-50/50 font-medium text-[#2C402E] focus:bg-white transition-colors"
            />
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2C402E] uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                <span>Fecha de Nacimiento</span>
              </span>
              <span className="text-[10px] bg-gold-100 text-gold-800 font-bold px-2 py-0.5 rounded-full">Club Cumpleaños</span>
            </label>
            <Input
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleInputChange}
              className="h-12 rounded-xl bg-warm-50/50 font-medium text-[#2C402E] focus:bg-white transition-colors"
            />
            <p className="text-[11px] text-warm-500 italic">
              * Te enviaremos descuentos exclusivos u obsequios en tu mes de cumpleaños.
            </p>
          </div>
        </div>

        {/* Read-only Email Field */}
        <div className="pt-4 border-t border-warm-100">
          <div className="space-y-2 max-w-md">
            <label className="text-xs font-bold text-warm-500 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-warm-400" />
              <span>Correo Electrónico (Identificador VIP)</span>
            </label>
            <div className="relative">
              <Input
                disabled
                value={dashboardData?.email || user?.email || ""}
                className="h-12 rounded-xl bg-warm-100/70 text-warm-600 font-medium pr-10 cursor-not-allowed border-warm-200"
              />
              <Lock className="w-4 h-4 text-warm-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[11px] text-warm-500">
              🔒 Tu correo es tu credencial de acceso principal. Para cambiarlo por motivos de seguridad, comunícate con soporte VIP.
            </p>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-6 border-t border-warm-100 flex items-center justify-end gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#2C402E] hover:bg-sage-800 text-white font-bold h-12 px-8 rounded-xl shadow-md transition-all duration-300"
          >
            <Save className="w-4 h-4 shrink-0" />
            <span>{isSubmitting ? "Guardando cambios..." : "Guardar Cambios en mi Cuenta"}</span>
          </Button>
        </div>
      </form>

      {/* Security Info Card */}
      <div className="bg-gradient-to-br from-[#2C402E]/5 to-[#C5A059]/10 p-6 rounded-3xl border border-[#C5A059]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#2C402E] text-[#C5A059] flex items-center justify-center shrink-0 shadow-sm mx-auto sm:mx-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#2C402E] font-serif">Protección de Datos & Privacidad ARCO</h4>
            <p className="text-xs text-warm-600">
              En Samay Munay protegemos tu información bajo los más estrictos protocolos de encriptación y respeto a tu privacidad.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
