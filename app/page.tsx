"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "./components/DashboardLayout";
import Link from "next/link";

type User = {
  id: string;
  email: string;
  name: string;
  permissions: string[];
  role: string;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@/lib/api").then(({ apiFetch }) => {
      apiFetch("/me/")
        .then((res) => {
          if (!res.ok) throw new Error("Failed");
          return res.json();
        })
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    });
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-navy text-xl">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  const isAdmin = user?.role === "admin";

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
        {/* Welcome Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome</h2>
          <p className="text-gray-700 text-lg font-medium">
            Hello, <span className="text-primary">{user?.name || "User"}</span>!
          </p>
          <p className="text-gray-600 mt-3">
            {isAdmin
              ? "You are logged in as an Administrator. You have full access to manage users and system settings."
              : "You are logged in. Use the sidebar to provide feedback and explore the system."}
          </p>
          {isAdmin && (
            <div className="mt-4 pt-4 border-t border-primary-100">
              <span className="inline-block px-4 py-1.5 text-sm font-bold bg-navy text-white rounded-full">
                ADMIN
              </span>
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <p className="text-3xl font-bold text-green-600">All Good</p>
          <p className="text-gray-500 mt-2">No pending actions</p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <ul className="space-y-3">
            {isAdmin && (
              <li className="text-primary hover:underline cursor-pointer">
                <Link href="/usermanagement">→ Manage Users</Link>
              </li>
            )}
            <li className="text-primary hover:underline cursor-pointer">
              <a
                href={`http://localhost:3000/?name=${encodeURIComponent(user?.name || "")}&department=Computer%20Science&purseNumber=12345678`}
                target="_blank"
                rel="noopener noreferrer"
              >
                → Give Feedback
              </a>
            </li>
            <li className="text-gray-500 italic">→ Change password (coming soon)</li>
            <li className="text-gray-500 italic">→ View activity log (coming soon)</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}