"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserDashboardData(emailOrUid: string) {
  try {
    if (!emailOrUid) {
      return { success: false, error: "Usuario no identificado" };
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUid },
          { supabaseUid: emailOrUid }
        ]
      },
      include: {
        addresses: {
          orderBy: { isDefault: "desc" }
        },
        orders: {
          include: {
            items: true,
            statusHistory: {
              orderBy: { createdAt: "desc" }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    // If user not in DB yet (e.g. newly authenticated OAuth without prisma sync), create minimal user
    if (!user && emailOrUid.includes("@")) {
      try {
        user = await prisma.user.create({
          data: {
            email: emailOrUid,
            supabaseUid: emailOrUid,
            name: emailOrUid.split("@")[0] || "Usuario de Bienestar",
          },
          include: {
            addresses: true,
            orders: {
              include: {
                items: true,
                statusHistory: true,
              }
            }
          }
        });
      } catch (e) {
        // Fallback if unique constraint fails
        user = await prisma.user.findUnique({
          where: { email: emailOrUid },
          include: {
            addresses: { orderBy: { isDefault: "desc" } },
            orders: { include: { items: true, statusHistory: true }, orderBy: { createdAt: "desc" } }
          }
        });
      }
    }

    if (!user) {
      return { success: false, error: "Usuario no encontrado en la base de datos" };
    }

    return { success: true, user: JSON.parse(JSON.stringify(user)) };
  } catch (error: any) {
    console.error("Error fetching user dashboard data:", error);
    return { success: false, error: error.message };
  }
}

export async function saveUserAddress(userId: string, data: { street: string; district: string; reference?: string; phone?: string; isDefault?: boolean }) {
  try {
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    // Check if user has no addresses, make this one default automatically
    const existingCount = await prisma.address.count({ where: { userId } });
    const isDefault = existingCount === 0 ? true : Boolean(data.isDefault);

    const address = await prisma.address.create({
      data: {
        userId,
        street: data.street,
        district: data.district,
        reference: data.reference || null,
        phone: data.phone || null,
        isDefault
      }
    });

    revalidatePath("/perfil");
    return { success: true, address: JSON.parse(JSON.stringify(address)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUserAddress(addressId: string, userId: string) {
  try {
    await prisma.address.deleteMany({
      where: { id: addressId, userId }
    });
    revalidatePath("/perfil");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function setDefaultUserAddress(addressId: string, userId: string) {
  try {
    await prisma.$transaction([
      prisma.address.updateMany({ where: { userId }, data: { isDefault: false } }),
      prisma.address.updateMany({ where: { id: addressId, userId }, data: { isDefault: true } })
    ]);
    revalidatePath("/perfil");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserProfile(userId: string, data: { name: string; phone?: string; birthDate?: string; documentId?: string }) {
  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone || null,
        documentId: data.documentId || null,
        birthDate: data.birthDate ? new Date(data.birthDate) : null
      }
    });
    revalidatePath("/perfil");
    return { success: true, user: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
