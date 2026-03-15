"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import axios, { AxiosError } from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { User } from '@/domain/entities/User';
import { useRouter } from "next/navigation";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // ✅ Login Function
  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post("/api/auth/login", { username, password });


      const token = res.data.accessToken;
      Cookies.set("token", token, { expires: 1 / 12 });

      router.push("/dashboard");
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

  // ✅ Signup Function
  const signup = async (data: User) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post("/api/auth/register", data);
      
      const token = res.data.accessToken;
      Cookies.set("token", token, { expires: 1 / 12 });

      router.push("/login");
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

  // ✅ Logout
  const logout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  return { loading, error, login, signup, logout };
}