"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Trash2, Check, Crown, Phone, Navigation, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { saveUserAddress, deleteUserAddress, setDefaultUserAddress } from "@/app/actions/profile";
import { cn } from "@/lib/utils";

interface Address {
  id: string;
  street: string;
  district: string;
  reference?: string | null;
  phone?: string | null;
  isDefault: boolean;
}

interface AddressManagerProps {
  userId: string;
  initialAddresses: Address[];
  onUpdate?: () => void;
}

const LIMA_DISTRICTS = [
  "San Juan de Miraflores",
  "Miraflores",
  "San Isidro",
  "Santiago de Surco",
  "La Molina",
  "San Borja",
  "Barranco",
  "Surquillo",
  "Jesús María",
  "Lince",
  "Magdalena del Mar",
  "Pueblo Libre",
  "San Miguel",
  "Chorrillos",
  "Villa El Salvador",
  "Villa María del Triunfo",
  "Lima Cercado"
];

export function AddressManager({ userId, initialAddresses, onUpdate }: AddressManagerProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  // Form state
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("San Juan de Miraflores");
  const [reference, setReference] = useState("");
  const [phone, setPhone] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const handleOpenModal = () => {
    setStreet("");
    setDistrict("San Juan de Miraflores");
    setReference("");
    setPhone("");
    setIsDefault(addresses.length === 0);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !district) {
      addToast({ type: "error", title: "Campos requeridos", description: "Por favor ingresa la calle y distrito." });
      return;
    }

    setIsSubmitting(true);
    const res = await saveUserAddress(userId, {
      street,
      district,
      reference,
      phone,
      isDefault
    });
    setIsSubmitting(false);

    if (res.success && res.address) {
      addToast({ type: "success", title: "Dirección guardada", description: "Tu dirección fue agregada exitosamente." });
      setIsModalOpen(false);
      
      // Update local state
      if (res.address.isDefault) {
        setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(res.address));
      } else {
        setAddresses(prev => [...prev, res.address]);
      }
      if (onUpdate) onUpdate();
    } else {
      addToast({ type: "error", title: "Error al guardar", description: res.error || "No se pudo guardar la dirección." });
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteUserAddress(id, userId);
    if (res.success) {
      addToast({ type: "info", title: "Dirección eliminada" });
      setAddresses(prev => prev.filter(a => a.id !== id));
      if (onUpdate) onUpdate();
    } else {
      addToast({ type: "error", title: "Error", description: "No se pudo eliminar la dirección." });
    }
  };

  const handleSetDefault = async (id: string) => {
    const res = await setDefaultUserAddress(id, userId);
    if (res.success) {
      addToast({ type: "success", title: "Dirección predeterminada", description: "Se actualizó tu dirección principal." });
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
      if (onUpdate) onUpdate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-warm-200/60">
        <div>
          <h3 className="text-xl font-bold text-warm-900 font-serif">Libreta de Direcciones</h3>
          <p className="text-sm text-warm-500">Administra tus lugares de entrega para un despacho más rápido.</p>
        </div>
        <Button
          onClick={handleOpenModal}
          className="bg-sage-700 hover:bg-sage-800 text-white shadow-md font-medium px-5 h-11 flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Nueva Dirección</span>
        </Button>
      </div>

      {/* Addresses Grid */}
      {addresses.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 text-center border border-warm-200/80 shadow-sm">
          <div className="w-16 h-16 bg-warm-100/80 rounded-full flex items-center justify-center mx-auto text-warm-400 mb-4">
            <MapPin className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-warm-900 font-serif mb-1">Aún no tienes direcciones guardadas</h4>
          <p className="text-warm-500 text-sm max-w-sm mx-auto mb-6">
            Agrega tu domicilio o centro de trabajo para recibir tus productos terapéuticos con total comodidad.
          </p>
          <Button onClick={handleOpenModal} variant="secondary" className="bg-sage-50 text-sage-800 border border-sage-200 hover:bg-sage-100">
            Agregar mi primera dirección
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence>
            {addresses.map((addr) => (
              <motion.div
                key={addr.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "relative bg-white rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md",
                  addr.isDefault
                    ? "border-2 border-gold-400/80 bg-gradient-to-br from-white via-white to-gold-50/20"
                    : "border border-warm-200/80 hover:border-sage-300/60"
                )}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
                        addr.isDefault ? "bg-gold-100 text-gold-700" : "bg-sage-50 text-sage-700"
                      )}>
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-warm-900 text-base leading-tight font-serif">{addr.district}</h4>
                        <span className="text-xs text-warm-400">Lima, Perú</span>
                      </div>
                    </div>

                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gold-100 text-gold-800 border border-gold-200/60 shadow-xs">
                        <Crown className="w-3.5 h-3.5 text-gold-600 fill-gold-500/20" />
                        Principal
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-warm-700 mb-6 pl-1">
                    <p className="font-medium text-warm-900 leading-snug">{addr.street}</p>
                    {addr.reference && (
                      <p className="text-xs text-warm-500 flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-warm-400 shrink-0" />
                        <span>Ref: {addr.reference}</span>
                      </p>
                    )}
                    {addr.phone && (
                      <p className="text-xs text-warm-500 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-warm-400 shrink-0" />
                        <span>Cel: {addr.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-warm-100 flex items-center justify-between gap-2">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-xs font-semibold text-sage-700 hover:text-sage-900 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Hacer principal
                    </button>
                  ) : (
                    <span className="text-xs font-medium text-gold-600/80 italic">Dirección preferida de envío</span>
                  )}

                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-2 text-warm-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors ml-auto cursor-pointer"
                    title="Eliminar dirección"
                    aria-label="Eliminar dirección"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal / Dialog for New Address */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agregar Nueva Dirección de Envío"
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-warm-700 uppercase tracking-wider mb-1.5">
              Distrito *
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-warm-200 bg-white text-warm-900 text-sm focus:outline-none focus:ring-2 focus:ring-sage-600 font-medium"
            >
              {LIMA_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-warm-700 uppercase tracking-wider mb-1.5">
              Calle, Avenida y Número *
            </label>
            <Input
              required
              placeholder="Ej. Av. Los Próceres 1234, Dpto 402"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="h-11 rounded-xl bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-warm-700 uppercase tracking-wider mb-1.5">
              Referencia de llegada (Opcional)
            </label>
            <Input
              placeholder="Ej. Frente a la farmacia, casa fachada blanca con rejas"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="h-11 rounded-xl bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-warm-700 uppercase tracking-wider mb-1.5">
              Teléfono de contacto para el Courier (Opcional)
            </label>
            <Input
              type="tel"
              placeholder="Ej. 987654321"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 rounded-xl bg-white"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <input
              type="checkbox"
              id="isDefaultCheck"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 rounded text-sage-600 focus:ring-sage-500 border-warm-300 cursor-pointer"
            />
            <label htmlFor="isDefaultCheck" className="text-sm font-medium text-warm-800 cursor-pointer select-none">
              Establecer como mi dirección principal de envío
            </label>
          </div>

          <div className="pt-6 border-t border-warm-100 flex items-center justify-end gap-3">
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
              className="bg-sage-700 hover:bg-sage-800 text-white h-11 px-6 shadow-md"
            >
              {isSubmitting ? "Guardando..." : "Guardar Dirección"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
