"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getStoreSettings() {
  try {
    let settings = await prisma.storeSettings.findFirst();
    
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          heroTitle: "Bienestar en cada respiración",
          heroSubtitle: "Descubre nuestra colección premium de aromaterapia y autocuidado.",
          heroImageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=2000&auto=format&fit=crop",
        }
      });
    }
    
    return { success: true, data: settings };
  } catch (error) {
    console.warn("DB not ready, falling back to mock settings", error);
    return { 
      success: true, 
      data: {
        id: "mock",
        heroTitle: "Bienestar en cada respiración",
        heroSubtitle: "Descubre nuestra colección premium de aromaterapia y autocuidado.",
        heroImageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=2000&auto=format&fit=crop",
        updatedAt: new Date()
      } 
    };
  }
}

export async function updateStoreSettings(data: {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
}) {
  try {
    const existing = await prisma.storeSettings.findFirst();
    
    if (existing) {
      await prisma.storeSettings.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.storeSettings.create({ data });
    }
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar settings:", error);
    return { success: false, error: "No se pudo actualizar la configuración." };
  }
}
