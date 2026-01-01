"use client";

import { useState } from "react";
import { apiFetch } from "../../lib/api";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

type RegisterForm = {
  email: string;
  name: string;
  password: string;
};

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>({
    email: "",
    name: "",
    password: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await apiFetch("/register/", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      if (data.email) {
        toast.error(data.email[0]);
      } else {
        toast.error("Something went wrong");
      }
      return;
    }
    toast.success("Account created successfully!");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light via-white to-accent-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-primary-200">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-navy mb-2">Create Account</h1>
            <p className="text-navy/70">Join the University Feedback Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-navy">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-primary focus:ring-4 focus:ring-primary-100 outline-none transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-navy">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-primary focus:ring-4 focus:ring-primary-100 outline-none transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-navy">Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-primary focus:ring-4 focus:ring-primary-100 outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full bg-primary hover:bg-primary-600 active:bg-primary-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-primary-300/50 transform hover:-translate-y-1 transition-all duration-200"
            >
              Register
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-navy/60">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="cursor-pointer text-primary font-semibold hover:text-primary-600 transition underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-navy/50 text-sm">
          User Management System © 2026
        </p>
      </div>
    </div>
  );
}