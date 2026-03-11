/**
 * COPY THIS FILE TO: src/app/api/auth/mobile/google/route.ts
 * in the shopkwetu web repo (Citrana/shopkwetu)
 *
 * Mobile Google OAuth — accepts Google ID token, returns JWT + user.
 */
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { AdminRole } from "@/models/AdminRole";

const JWT_SECRET = process.env.MOBILE_JWT_SECRET!;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;

async function verifyGoogleToken(idToken: string) {
  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
  );
  if (!res.ok) return null;
  const payload = await res.json();
  if (payload.aud !== GOOGLE_CLIENT_ID) return null;
  return payload as { sub: string; email: string; name: string; picture: string };
}

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "Google ID token is required" },
        { status: 400 }
      );
    }

    const googleUser = await verifyGoogleToken(idToken);
    if (!googleUser) {
      return NextResponse.json(
        { error: "Invalid Google token" },
        { status: 401 }
      );
    }

    await connectDB();

    // Find or create user
    let dbUser = await User.findOne({ email: googleUser.email }).lean();

    if (!dbUser) {
      const count = await User.countDocuments();
      const created = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        image: googleUser.picture,
        role: count === 0 ? "SUPER_ADMIN" : "CLIENT",
      });
      dbUser = created.toObject();
    }

    // Load admin permissions if applicable
    let permissions: string[] = [];
    if (dbUser.role === "ADMIN" && dbUser.adminRoleId) {
      const adminRole = await AdminRole.findById(dbUser.adminRoleId).lean();
      permissions = adminRole?.permissions ?? [];
    }

    const user = {
      id: String(dbUser._id),
      name: dbUser.name,
      email: dbUser.email,
      image: dbUser.image,
      role: dbUser.role,
      shopId: dbUser.shopId ? String(dbUser.shopId) : undefined,
      locale: dbUser.locale ?? "fr",
      permissions,
    };

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return NextResponse.json({ token, user });
  } catch (error) {
    console.error("Mobile Google auth error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
