import { getStoreSettings } from "@/app/actions/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AjustesPage() {
  const { data: settings } = await getStoreSettings();

  return (
    <div className="animate-in fade-in duration-700 max-w-4xl mx-auto">
      <SettingsForm initialData={settings} />
    </div>
  );
}
