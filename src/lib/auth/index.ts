import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const COOKIE_NAME = "sentiero_session";
const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "sentiero-del-se-dev-secret-key-min-32-chars-2026"
);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET_KEY);
}

export async function verifySessionToken(
  token: string
): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    if (typeof payload.userId === "string") {
      return { userId: payload.userId };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Returns the currently authenticated user from the session cookie.
 * In development, if no cookie exists yet, falls back to the seeded demo user
 * so that /oggi is immediately usable while strictly maintaining userId scoping.
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (token) {
      const verified = await verifySessionToken(token);
      if (verified?.userId) {
        const user = await prisma.user.findUnique({
          where: { id: verified.userId },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            theme: true,
            locale: true,
            timezone: true,
          },
        });
        if (user) return user;
      }
    }

    // Development auto-fallback to the verified demo user
    const demoUser = await prisma.user.findUnique({
      where: { email: "demo@sentiero.app" },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        theme: true,
        locale: true,
        timezone: true,
      },
    });

    return demoUser;
  } catch (error) {
    console.error("Error retrieving current user:", error);
    return null;
  }
}

/**
 * Enforces authenticated session. Throws an error if no authenticated user is found.
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED: Invalid session or user not found.");
  }
  return user;
}
