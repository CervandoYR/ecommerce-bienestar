import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    
    // Verify Firebase token securely on the server
    const decodedToken = await verifyToken(token);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { uid, email, name, picture } = decodedToken;

    // Upsert the user in our PostgreSQL database via Prisma
    // We use the Firebase UID as the unique identifier constraint
    const user = await prisma.user.upsert({
      where: { firebaseUid: uid },
      update: {
        // Only update these fields if they changed (e.g. they changed their Google picture)
        name: name || email?.split('@')[0] || 'User',
        avatarUrl: picture || null,
        // We do NOT overwrite phone or address here, so they can keep their checkout preferences
      },
      create: {
        firebaseUid: uid,
        email: email || '',
        name: name || email?.split('@')[0] || 'User',
        avatarUrl: picture || null,
        role: "CLIENT",
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Sync user error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
