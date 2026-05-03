import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Role Constants (must match useAuth.ts) ────────────────────────────────────
const ROLES = {
  COACH: 0,
  ANALYST: 1,
} as const;

// ─── Decode JWT (Edge-compatible — no Node.js APIs) ────────────────────────────
const decodeToken = (token: string): { role: number; name: string } | null => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return {
      role: Number(payload.role),
      name: payload.name,
    };
  } catch {
    return null;
  }
};

// ─── Middleware ────────────────────────────────────────────────────────────────
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // ── Not logged in → redirect to login ──────────────────────────────────────
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const decoded = decodeToken(token);

  // ── Invalid token → redirect to login ──────────────────────────────────────
  if (!decoded) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const { role, name } = decoded;

  // ── Coach trying to access analyst page ────────────────────────────────────
  if (pathname.startsWith('/analytics') && role !== ROLES.ANALYST) {
    return NextResponse.redirect(new URL(`/coach/${encodeURIComponent(name)}`, request.url));
  }

  // ── Analyst trying to access coach page ────────────────────────────────────
  if (pathname.startsWith('/coach') && role !== ROLES.COACH) {
    return NextResponse.redirect(new URL('/analytics', request.url));
  }

  return NextResponse.next();
}

// ─── Protected Routes ──────────────────────────────────────────────────────────
export const config = {
  matcher: ['/coach/:path*', '/analytics/:path*'],
};
