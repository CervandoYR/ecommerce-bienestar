import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";

    if (!q || q.length < 2) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      include: {
        category: true,
      },
      take: 6,
      orderBy: {
        isFeatured: "desc",
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error in search API:", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
