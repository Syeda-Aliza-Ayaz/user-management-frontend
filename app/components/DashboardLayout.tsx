"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

type User = {
  id: string;
  email: string;
  name: string;
  permissions: string[];
  role: string;
};

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    apiFetch("/me/")
      .then((res) => {
        if (!res.ok) {
          toast.error("Session expired. Please log in again.");
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load user data");
        router.push("/login");
      });
  }, [router]);

  const handleLogout = async () => {
    await apiFetch("/logout/", { method: "POST" });
    toast.success("Logged out successfully");
    router.push("/login");
  };

  // Permissions check
  const canManageUsers =
    user?.permissions.includes("can_view_users") ||
    user?.permissions.includes("can_delete_users") || user?.role == 'admin';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="text-navy text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-light flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl flex flex-col">
        <div className="p-6 border-b border-primary-100">
          <h2 className="text-2xl font-bold text-navy">Dashboard</h2>
          <p className="text-sm text-navy/60 mt-1">Welcome back, {user.name}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/"
            className="cursor-pointer flex items-center gap-3 px-4 py-3 text-navy hover:bg-primary-50 hover:text-primary rounded-xl transition"
          >
            <span className="text-xl">🏠</span>
            <span className="font-medium">Home</span>
          </Link>

          {canManageUsers && (
            <Link
              href="/usermanagement"
              className="cursor-pointer flex items-center gap-3 px-4 py-3 text-navy hover:bg-primary-50 hover:text-primary rounded-xl transition"
            >
              <span className="text-xl">👥</span>
              <span className="font-medium">User Management</span>
            </Link>
          )}

          <a
            href={`http://localhost:3001/?name=${encodeURIComponent(user.name)}`}
            // Replace with live URL when deployed:
            // href={`https://your-feedback-app.vercel.app/?name=${encodeURIComponent(user.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer flex items-center gap-3 px-4 py-3 text-navy hover:bg-accent-50 hover:text-accent rounded-xl transition font-medium"
          >
            <span className="text-xl">📝</span>
            <span>Give Feedback</span>
          </a>
        </nav>

        <div className="p-4 border-t border-primary-100">
          <button
            onClick={handleLogout}
            className="cursor-pointer w-full bg-primary hover:bg-primary-600 active:bg-primary-700 text-white font-medium py-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-navy">
            Hello, <span className="text-primary">{user.name}</span>
          </h1>
          <p className="text-navy/70 mt-2">
            {canManageUsers
              ? "Manage users or provide feedback below."
              : "Explore the system and provide your valuable feedback."}
          </p>
        </header>

        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}