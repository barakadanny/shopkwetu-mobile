/**
 * COPY THIS FILE TO: src/app/api/auth/mobile/session/route.ts
 * in the shopkwetu web repo (Citrana/shopkwetu)
 *
 * Mobile session refresh — validates JWT, returns fresh user data + new token.
 */
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { AdminRole } from "@/models/AdminRole";

const JWT_SECRET = process.env.MOBILE_JWT_SECRET!;

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded: { sub: string; email: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as typeof decoded;
    } catch {
      return NextResponse.json(
        { error: "Token expired or invalid" },
        { status: 401 }
      );
    }

    await connectDB();
    const dbUser = await User.findById(decoded.sub).lean();

    if (!dbUser || !dbUser.isActive) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
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

    // Issue fresh token
    const newToken = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return NextResponse.json({ token: newToken, user });
  } catch (error) {
    console.error("Mobile session error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
