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
          heroImageUrl: "/samay-munay-hero.png",
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
        heroImageUrl: "/samay-munay-hero.png",
        updatedAt: new Date()
      } 
    };
  }
}

export async function updateStoreSettings(data: {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  promoModalActive?: boolean;
  promoModalImage?: string;
  promoModalTitle?: string;
  promoModalText?: string;
  promoModalLink?: string;
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
    
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar settings:", error);
    return { success: false, error: "No se pudo actualizar la configuración." };
  }
}
