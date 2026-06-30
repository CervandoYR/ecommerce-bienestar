"use client";

import { useState, useTransition } from "react";
import { submitArcoRequest } from "@/app/actions/arco";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ArcoRightsPage() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (formData: FormData) => {
    setMessage(null);
    startTransition(async () => {
      const res = await submitArcoRequest(formData);
      if (res?.error) {
        setMessage({ type: "error", text: res.error });
      } else {
        setMessage({ type: "success", text: "Tu solicitud ha sido registrada y será atendida dentro del plazo legal." });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-warm-900 mb-2">Derechos ARCO</h1>
      <p className="text-warm-600 mb-8">
        En cumplimiento con la Ley N° 29733 (Ley de Protección de Datos Personales), puedes ejercer tus derechos de Acceso, Rectificación, Cancelación y Oposición.
      </p>

      {message && (
        <div className={`p-4 mb-6 rounded-xl text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}

      <form action={handleSubmit} className="space-y-6 bg-white p-6 rounded-3xl shadow-sm border border-warm-100">
        <div>
          <label className="block text-sm font-semibold text-warm-900 mb-2">
            Tipo de Solicitud
          </label>
          <select 
            name="type" 
            required
            className="w-full h-12 px-4 border-2 border-warm-200 rounded-xl bg-transparent text-warm-900 focus:outline-none focus:border-sage-600"
          >
            <option value="ACCESO">Acceso (Conocer mis datos)</option>
            <option value="RECTIFICACION">Rectificación (Corregir mis datos)</option>
            <option value="CANCELACION">Cancelación (Eliminar mi cuenta y datos)</option>
            <option value="OPOSICION">Oposición (Dejar de recibir publicidad)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-warm-900 mb-2">
            Detalle tu solicitud
          </label>
          <textarea 
            name="details" 
            required
            rows={5}
            placeholder="Por favor, describe exactamente qué datos deseas corregir o eliminar..."
            className="w-full p-4 border-2 border-warm-200 rounded-xl bg-transparent text-warm-900 focus:outline-none focus:border-sage-600 resize-none"
          ></textarea>
        </div>

        <Button type="submit" disabled={isPending} className="w-full h-12 rounded-xl text-base">
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar Solicitud Legal"}
        </Button>
      </form>
    </div>
  );
}
