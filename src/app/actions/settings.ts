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
          heroButtonText: "Comprar Ahora",
          heroButtonLink: "/productos",
          heroBadgeText: "EXCELENCIA EN BIENESTAR",
          bentoTitle: "Diseñamos tu santuario personal en casa.",
          bentoSubtitle: "Convierte tu hogar en el único lugar donde el estrés no tiene permiso para entrar. Nuestra selección de rituales térmicos y aromas botánicos está diseñada para apagar tu mente y recuperar tu energía.",
          bentoImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
          bentoCard2Title: "Sueño Ininterrumpido",
          bentoCard2Desc: "Difusor Ultrasónico + Aceite de Lavanda de curaduría seleccionada.",
          bentoCard2Image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop",
          bentoCard3Title: "Alivio Inmediato",
          bentoCard3Desc: "Set Terapéutico x6 Aceites seleccionados rigurosamente sin rellenos sintéticos.",
          bentoCard3Image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop",
          curatedTitle: "Nuestra Selección de Bienestar",
          curatedSubtitle: "No improvisamos con tu tranquilidad. Cada producto supera un estricto filtro de pureza para entregarte únicamente herramientas que garanticen tu calma absoluta.",
          curated1Title: "Terapia Térmica",
          curated1Desc: "Compresas calientes herbolarias y almohadillas terapéuticas para aliviar la tensión física, el dolor muscular y relajar el cuello y espalda alta.",
          curated1Image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
          curated2Title: "Aromaterapia Pura",
          curated2Desc: "Aceites esenciales puros y brumas de almohada seleccionadas rigurosamente por su pureza, libres de fragancias sintéticas, para un descanso profundo.",
          curated2Image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop",
          curated3Title: "Ambientes Serenos",
          curated3Desc: "Difusores ultrasónicos, velas de soja y aromatizantes botánicos diseñados específicamente para purificar y crear atmósferas de calma en el hogar.",
          curated3Image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop",
          purposeTitle: "No vendemos aromas. Embotellamos momentos de paz para tu rutina.",
          purposeSubtitle: "CURADURÍA EXPERTA",
          purposeDesc: "En un mundo diseñado para mantenerte en alerta constante, creemos que el verdadero lujo es el silencio mental y un hogar que te abrace. Buscamos y seleccionamos rigurosamente productos de alta pureza que dialogan con tu sistema nervioso, devolviéndote a un estado natural de quietud.",
          purposeImage: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?q=80&w=1200&auto=format&fit=crop",
          splitKicker: "CURADURÍA EXPERTA",
          splitTitle: "El arte de apagar el ruido y reconectar contigo.",
          splitDescription: "Vivimos a un ritmo que agota. Por eso, buscamos y seleccionamos meticulosamente las mejores herramientas para tu descanso: desde el calor profundo de nuestras compresas térmicas, hasta brumas y aceites botánicos de alta pureza.",
          splitFooterLeft: "CALOR TERAPÉUTICO",
          splitFooterRight: "AROMATERAPIA PURA",
          splitImageUrl: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?q=80&w=1000&auto=format&fit=crop",
          splitButtonText: "Explorar colección",
          splitButtonLink: "/productos",
          promise1Title: "Pureza Botánica",
          promise1Desc: "Curaduría estricta de productos botánicos, libres de parabenos y derivados del petróleo. Solo marcas y artesanos de absoluta confianza.",
          promise2Title: "Grado Terapéutico",
          promise2Desc: "Seleccionamos fórmulas e ingredientes que preservan la integridad del producto, diseñados específicamente para aliviar la tensión física y mental.",
          promise3Title: "Entrega Local Exprés",
          promise3Desc: "Envíos Same-Day en Lima y atención personalizada. Empaquetado consciente para que tu experiencia de paz empiece al abrir la caja.",
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
        heroButtonText: "Comprar Ahora",
        heroButtonLink: "/productos",
        heroBadgeText: "EXCELENCIA EN BIENESTAR",
        promoModalActive: false,
        promoModalImage: null,
        promoModalTitle: null,
        promoModalText: null,
        promoModalLink: null,
        bentoTitle: "Diseñamos tu santuario personal en casa.",
        bentoSubtitle: "Convierte tu hogar en el único lugar donde el estrés no tiene permiso para entrar. Nuestra selección de rituales térmicos y aromas botánicos está diseñada para apagar tu mente y recuperar tu energía.",
        bentoImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
        bentoCard2Title: "Sueño Ininterrumpido",
        bentoCard2Desc: "Difusor Ultrasónico + Aceite de Lavanda de curaduría seleccionada.",
        bentoCard2Image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop",
        bentoCard3Title: "Alivio Inmediato",
        bentoCard3Desc: "Set Terapéutico x6 Aceites seleccionados rigurosamente sin rellenos sintéticos.",
        bentoCard3Image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop",
        curatedTitle: "Nuestra Selección de Bienestar",
        curatedSubtitle: "No improvisamos con tu tranquilidad. Cada producto supera un estricto filtro de pureza para entregarte únicamente herramientas que garanticen tu calma absoluta.",
        curated1Title: "Terapia Térmica",
        curated1Desc: "Compresas calientes herbolarias y almohadillas terapéuticas para aliviar la tensión física, el dolor muscular y relajar el cuello y espalda alta.",
        curated1Image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
        curated2Title: "Aromaterapia Pura",
        curated2Desc: "Aceites esenciales puros y brumas de almohada seleccionadas rigurosamente por su pureza, libres de fragancias sintéticas, para un descanso profundo.",
        curated2Image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop",
        curated3Title: "Ambientes Serenos",
        curated3Desc: "Difusores ultrasónicos, velas de soja y aromatizantes botánicos diseñados específicamente para purificar y crear atmósferas de calma en el hogar.",
        curated3Image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop",
        purposeTitle: "No vendemos aromas. Embotellamos momentos de paz para tu rutina.",
        purposeSubtitle: "CURADURÍA EXPERTA",
        purposeDesc: "En un mundo diseñado para mantenerte en alerta constante, creemos que el verdadero lujo es el silencio mental y un hogar que te abrace. Buscamos y seleccionamos rigurosamente productos de alta pureza que dialogan con tu sistema nervioso, devolviéndote a un estado natural de quietud.",
        purposeImage: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?q=80&w=1200&auto=format&fit=crop",
        splitKicker: "CURADURÍA EXPERTA",
        splitTitle: "El arte de apagar el ruido y reconectar contigo.",
        splitDescription: "Vivimos a un ritmo que agota. Por eso, buscamos y seleccionamos meticulosamente las mejores herramientas para tu descanso: desde el calor profundo de nuestras compresas térmicas, hasta brumas y aceites botánicos de alta pureza.",
        splitFooterLeft: "CALOR TERAPÉUTICO",
        splitFooterRight: "AROMATERAPIA PURA",
        splitImageUrl: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?q=80&w=1000&auto=format&fit=crop",
        splitButtonText: "Explorar colección",
        splitButtonLink: "/productos",
        promise1Title: "Pureza Botánica",
        promise1Desc: "Curaduría estricta de productos botánicos, libres de parabenos y derivados del petróleo. Solo marcas y artesanos de absoluta confianza.",
        promise2Title: "Grado Terapéutico",
        promise2Desc: "Seleccionamos fórmulas e ingredientes que preservan la integridad del producto, diseñados específicamente para aliviar la tensión física y mental.",
        promise3Title: "Entrega Local Exprés",
        promise3Desc: "Envíos Same-Day en Lima y atención personalizada. Empaquetado consciente para que tu experiencia de paz empiece al abrir la caja.",
        updatedAt: new Date()
      } 
    };
  }
}

export async function updateStoreSettings(data: Record<string, any>) {
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
    revalidatePath("/admin/ajustes", "page");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar settings:", error);
    return { success: false, error: "No se pudo actualizar la configuración." };
  }
}
