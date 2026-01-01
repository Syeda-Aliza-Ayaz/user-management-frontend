// "use client";

// import { useState } from "react";
// import { apiFetch } from "../../lib/api";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const res = await apiFetch("/login/", {
//       method: "POST",
//       credentials: "include",
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();
//     if(res.ok){
//         toast.success("Logged in successfully")
//         router.push("/");
//     }
//     else{
//         if(res.status==401){
//             toast.error("Invalid credentials")
//         }
//     }
//     console.log(data);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md space-y-4"
//       >
//         <h1 className="text-2xl font-semibold text-center">Login</h1>

//         <input
//           type="email"
//           placeholder="Email"
//           required
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           required
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button
//           type="submit"
//           className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//         >
//           Login
//         </button>
//         <Link href="/register"><button className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">Create an account</button></Link>
//       </form>
//     </div>
//   );
// }
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light via-white to-accent-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-primary-200">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-navy mb-2">Welcome Back</h1>
            <p className="text-navy/70">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-navy">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-primary focus:ring-4 focus:ring-primary-100 outline-none transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-navy">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-primary focus:ring-4 focus:ring-primary-100 outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full bg-primary hover:bg-primary-600 active:bg-primary-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-primary-300/50 transform hover:-translate-y-1 transition-all duration-200"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-navy/60">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary font-semibold hover:text-primary-600 transition hover:underline cursor-pointer">
                Create one
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