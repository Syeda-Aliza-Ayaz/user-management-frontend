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
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-black mb-3">Create Account</h1>
            <p className="text-gray-600 text-lg">Join the University Feedback Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition text-black placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition text-black placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition text-black placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Register
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="cursor-pointer text-black font-semibold hover:underline transition"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}