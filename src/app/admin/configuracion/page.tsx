import { getStoreSettings } from "@/app/actions/settings";
import { SettingsForm } from "./settings-form";

export const metadata = {
  title: "Configuración de la Tienda | Admin",
};

export default async function SettingsPage() {
  const { data: settings } = await getStoreSettings();

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-warm-900 mb-2">Configuración</h1>
        <p className="text-warm-500">
          Administra la apariencia y datos globales de tu tienda online.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-warm-100">
          <h2 className="text-xl font-semibold text-warm-900">Hero Section (Inicio)</h2>
          <p className="text-sm text-warm-500">
            Esta es la sección principal que ven tus clientes al entrar a la tienda.
          </p>
        </div>
        
        <div className="p-6">
          <SettingsForm initialData={settings} />
        </div>
      </div>
    </div>
  );
}
