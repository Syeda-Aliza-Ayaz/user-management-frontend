"use client";

import { useState } from "react";
import { apiFetch } from "../../lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await apiFetch("/login/", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      toast.success("Logged in successfully!");
      router.push("/");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-black mb-3">Welcome Back</h1>
            <p className="text-gray-600 text-lg">Sign in to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition text-black placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition text-black placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Sign In
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-10 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="cursor-pointer text-black font-semibold hover:underline transition"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-10 text-gray-500 text-sm">
          User Management System © 2026
        </p>
      </div>
    </div>
  );
}