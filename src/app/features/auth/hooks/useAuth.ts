"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import axios, { AxiosError } from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { User } from '@/domain/entities/User';
import { useRouter } from "next/navigation";

// ─── Role Constants ────────────────────────────────────────────────────────────
export const ROLES = {
  COACH: 0,
  ANALYST: 1,
} as const;

// ─── JWT Decoder ───────────────────────────────────────────────────────────────
// Decodes the JWT payload without verifying the signature (client-side only)
const decodeToken = (token: string): { role: number; name: string; sub: string } | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    // .NET claim keys
    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      ?? payload["role"];

    const name = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
      ?? payload["name"];

    const sub = payload["sub"];

    if (role === undefined || name === undefined) {
      console.error("Missing claims in token. Full payload:", payload);
      return null;
    }

    return {
      role: Number(role),
      name: String(name),
      sub: String(sub),
    };
  } catch {
    return null;
  }
};

// ─── Role → Route ──────────────────────────────────────────────────────────────
const getRedirectPath = (role: number, name: string): string => {
  switch (role) {
    case ROLES.COACH:
      // Route includes the coach's name as a URL param
      return `/coach/${encodeURIComponent(name)}`;
    case ROLES.ANALYST:
      return `/analytics`;
    default:
      // Fallback for unknown roles
      return `/`;
  }
};

// ─── useAuth Hook ──────────────────────────────────────────────────────────────
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post("/api/auth/login", { username, password });

      const token = res.data.accessToken;
      Cookies.set("token", token, { expires: 1 / 12 });

      // Decode token and redirect based on role
      const decoded = decodeToken(token);
      if (!decoded) throw new Error("Invalid token");

      const path = getRedirectPath(decoded.role, decoded.name);
      router.push(path);
 console.log("Login successful, redirecting to:", decoded.role , decoded.name, path);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("Invalid username or password");
      } else {
        setError("Something went wrong, please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Signup ─────────────────────────────────────────────────────────────────
  const signup = async (data: User) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post("/api/auth/register", data);

      const token = res.data.accessToken;
      Cookies.set("token", token, { expires: 1 / 12 });

      // Decode token and redirect based on role (same logic as login)
      const decoded = decodeToken(token);
      if (!decoded) {
        // Fallback: go to login if token is missing
        router.push("/login");
        return;
      }

      const path = getRedirectPath(decoded.role, decoded.name);
      router.push(path);

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 400) {
          setError("User already exists");
        } else if (axiosError.response?.status === 409) {
          setError("Invalid registration data");
        } else {
          setError("Signup failed");
        }
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  return { loading, error, login, signup, logout };
}