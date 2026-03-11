/**
 * COPY THIS FILE TO: src/app/api/auth/mobile/login/route.ts
 * in the shopkwetu web repo (Citrana/shopkwetu)
 *
 * Mobile credentials login — returns JWT + user object.
 */
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { AdminRole } from "@/models/AdminRole";
import { authLimiter, getIP } from "@/lib/rate-limit";

const JWT_SECRET = process.env.MOBILE_JWT_SECRET!;

export async function POST(req: Request) {
  const limited = authLimiter.check(getIP(req));
  if (limited) return limited;

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const dbUser = await User.findOne({ email }).lean();

    if (!dbUser || !dbUser.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, dbUser.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
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
    console.error("Mobile login error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
