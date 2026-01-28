// // "use client";

// // import { useEffect, useState } from "react";
// // import DashboardLayout from "./components/DashboardLayout";
// // import Link from "next/link";

// // type User = {
// //   id: string;
// //   email: string;
// //   name: string;
// //   permissions: string[];
// //   role: string;
// // };

// // export default function Home() {
// //   const [user, setUser] = useState<User | null>(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     import("@/lib/api").then(({ apiFetch }) => {
// //       apiFetch("/me/")
// //         .then((res) => {
// //           if (!res.ok) throw new Error("Failed");
// //           return res.json();
// //         })
// //         .then((data) => {
// //           setUser(data);
// //           setLoading(false);
// //         })
// //         .catch(() => {
// //           setLoading(false);
// //         });
// //     });
// //   }, []);

// //   if (loading) {
// //     return (
// //       <DashboardLayout>
// //         <div className="text-center py-20">
// //           <p className="text-navy text-xl">Loading dashboard...</p>
// //         </div>
// //       </DashboardLayout>
// //     );
// //   }

// //   const isAdmin = user?.role === "admin";

// //   return (
// //     <DashboardLayout>
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
// //         {/* Welcome Card */}
// //         <div className="bg-white rounded-xl shadow-md p-6">
// //           <h2 className="text-xl font-semibold mb-4">Welcome</h2>
// //           <p className="text-gray-700 text-lg font-medium">
// //             Hello, <span className="text-primary">{user?.name || "User"}</span>!
// //           </p>
// //           <p className="text-gray-600 mt-3">
// //             {isAdmin
// //               ? "You are logged in as an Administrator. You have full access to manage users and system settings."
// //               : "You are logged in. Use the sidebar to provide feedback and explore the system."}
// //           </p>
// //           {isAdmin && (
// //             <div className="mt-4 pt-4 border-t border-primary-100">
// //               <span className="inline-block px-4 py-1.5 text-sm font-bold bg-navy text-white rounded-full">
// //                 ADMIN
// //               </span>
// //             </div>
// //           )}
// //         </div>

// //         {/* System Status */}
// //         <div className="bg-white rounded-xl shadow-md p-6">
// //           <h2 className="text-xl font-semibold mb-4">System Status</h2>
// //           <p className="text-3xl font-bold text-green-600">All Good</p>
// //           <p className="text-gray-500 mt-2">No pending actions</p>
// //         </div>

// //         {/* Quick Actions */}
// //         <div className="bg-white rounded-xl shadow-md p-6">
// //           <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
// //           <ul className="space-y-3">
// //             {isAdmin && (
// //               <li className="text-primary hover:underline cursor-pointer">
// //                 <Link href="/usermanagement">→ Manage Users</Link>
// //               </li>
// //             )}
// //             <li className="text-primary hover:underline cursor-pointer">
// //               <a
// //                 href={`http://localhost:3000/?name=${encodeURIComponent(user?.name || "")}&department=Computer%20Science&purseNumber=12345678`}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //               >
// //                 → Give Feedback
// //               </a>
// //             </li>
// //             <li className="text-gray-500 italic">→ Change password (coming soon)</li>
// //             <li className="text-gray-500 italic">→ View activity log (coming soon)</li>
// //           </ul>
// //         </div>
// //       </div>
// //     </DashboardLayout>
// //   );
// // }
// "use client";

// import { useEffect, useState } from "react";
// import { apiFetch, getCSRFToken } from "@/lib/api";
// import toast from "react-hot-toast";

// type User = {
//   id: string;
//   email: string;
//   name: string;
//   permissions: string[];
//   role: string;
//   department?: string;
//   purse_number?: string;
// };

// export default function UserList() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch all users directly — no auth check
//     apiFetch("/users/")
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch users");
//         return res.json();
//       })
//       .then((data) => setUsers(data))
//       .catch((err) => {
//         console.error(err);
//         toast.error("Could not load users");
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const filteredUsers = users.filter(
//     (user) =>
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleDeleteUser = async (userId: string) => {
//     if (!confirm(`Delete ${users.find(u => u.id === userId)?.name || "this user"}?`)) return;

//     const csrfToken = await getCSRFToken();
//     const res = await apiFetch(`/users/${userId}/`, {
//       method: "DELETE",
//       headers: { "X-CSRFToken": csrfToken },
//     });

//     if (res.ok) {
//       toast.success("User deleted");
//       setUsers(users.filter((u) => u.id !== userId));
//     } else {
//       toast.error("Failed to delete user");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <p className="text-xl text-black">Loading users...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 px-8 py-8">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-4xl font-bold text-black">All Users</h1>
//           <p className="text-gray-600 mt-2">List of all registered users in the system</p>
//         </div>
//       </div>

//       {/* Search */}
//       <div className="max-w-7xl mx-auto px-8 py-10">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search by name or email..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-14 pr-8 py-5 text-lg rounded-3xl border border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black/10 transition placeholder-gray-500"
//           />
//           <svg
//             className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 pointer-events-none"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//             />
//           </svg>
//         </div>
//       </div>

//       {/* Users Cards */}
//       <div className="max-w-7xl mx-auto px-8 pb-16">
//         {filteredUsers.length === 0 ? (
//           <div className="text-center py-32">
//             <p className="text-2xl text-gray-600">
//               {searchTerm ? "No matching users" : "No users in the system"}
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//             {filteredUsers.map((user) => {
//               const initials = user.name
//                 .split(" ")
//                 .map((n) => n[0])
//                 .join("")
//                 .toUpperCase()
//                 .slice(0, 2);

//               return (
//                 <div
//                   key={user.id}
//                   className="bg-white rounded-3xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col"
//                 >
//                   <div className="p-8 flex-1">
//                     <div className="flex items-center gap-6 mb-6">
//                       <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl font-bold text-gray-700 flex-shrink-0">
//                         {initials}
//                       </div>
//                       <div className="min-w-0 flex-1">
//                         <h3 className="text-xl font-bold text-black truncate">{user.name}</h3>
//                         <p className="text-gray-600 text-sm truncate">{user.email}</p>
//                         {user.department && (
//                           <p className="text-gray-500 text-sm mt-1 truncate">{user.department}</p>
//                         )}
//                         {user.purse_number && (
//                           <p className="text-gray-500 text-sm truncate">{user.purse_number}</p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Permissions */}
//                     <div className="mt-4">
//                       <p className="text-sm font-medium text-gray-700 mb-3">Permissions</p>
//                       {user.permissions.length > 0 ? (
//                         <div className="flex flex-wrap gap-2">
//                           {user.permissions.map((perm) => (
//                             <span
//                               key={perm}
//                               className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-full"
//                             >
//                               {perm.replace("can_", "").replace("_", " ")}
//                             </span>
//                           ))}
//                         </div>
//                       ) : (
//                         <p className="text-gray-500 text-sm italic">No permissions</p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="px-8 pb-8 mt-auto">
//                     <button
//                       onClick={() => handleDeleteUser(user.id)}
//                       className="cursor-pointer w-full bg-red-600 hover:bg-red-700 text-white font-medium py-4 rounded-2xl transition shadow hover:shadow-md"
//                     >
//                       Delete User
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { apiFetch, getCSRFToken } from "@/lib/api";
import toast from "react-hot-toast";

type User = {
  id: string;
  email: string;
  name: string;
  permissions: string[];
  role: string;
  department?: string;
  purse_number?: string;
};

export default function AllUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/users/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error(err);
        toast.error("Could not load users");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(`Delete ${users.find(u => u.id === userId)?.name || "this user"}?`)) return;

    const csrfToken = await getCSRFToken();
    const res = await apiFetch(`/users/${userId}/`, {
      method: "DELETE",
      headers: { "X-CSRFToken": csrfToken },
    });

    if (res.ok) {
      toast.success("User deleted");
      setUsers(users.filter((u) => u.id !== userId));
    } else {
      toast.error("Failed to delete user");
    }
  };

  const openFeedbackAsUser = (user: User) => {
    const baseUrl = process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL || "http://localhost:3000";

    const params = new URLSearchParams();
    params.append("name", user.name);
    if (user.department) params.append("department", user.department);
    if (user.purse_number) params.append("purseNumber", user.purse_number);

    window.open(`${baseUrl}?${params.toString()}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-2xl font-medium text-gray-900">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-10 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">User Directory</h1>
          <p className="text-gray-600 mt-3 text-lg">Complete list of all registered users</p>
        </div>
      </header>

      {/* Search */}
      <div className="px-6 py-10 md:px-12">
        <div className="max-w-4xl mx-auto relative">
          <input
            type="text"
            placeholder="Search by name, email, department or purse number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-5 text-lg bg-white border border-gray-300 rounded-2xl focus:border-gray-900 focus:ring-4 focus:ring-gray-300/30 outline-none transition-all placeholder-gray-500 text-gray-900 cursor-text"
          />
          <svg
            className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Users Grid */}
<main className="px-6 pb-16 md:px-12">
  {filteredUsers.length === 0 ? (
    <div className="text-center py-32">
      <p className="text-2xl font-medium text-gray-600">
        {searchTerm ? "No matching users found" : "No users registered yet"}
      </p>
      <p className="text-gray-500 mt-2">{searchTerm ? "Try different keywords" : "The list is currently empty"}</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
      {filteredUsers.map((user) => {
        const initials = user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        return (
          <div
            key={user.id}
            className="bg-white rounded-3xl shadow-lg border border-gray-200 hover:shadow-2xl hover:border-gray-400 transition-all duration-300 flex flex-col group cursor-pointer"
          >
            <div className="p-10 flex-1">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-4xl font-bold text-gray-700 flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 truncate group-hover:text-gray-700 transition-colors">
                    {user.name}
                  </h3>
                  <p className="text-gray-600 text-base truncate">{user.email}</p>
                  {user.department && (
                    <p className="text-gray-500 text-base mt-1 truncate">{user.department}</p>
                  )}
                  {user.purse_number && (
                    <p className="text-gray-500 text-base truncate">{user.purse_number}</p>
                  )}
                </div>
              </div>

              {/* Permissions */}
              <div className="mt-6">
                <p className="text-base font-medium text-gray-600 mb-3">Permissions</p>
                {user.permissions.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {user.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full border border-gray-200"
                      >
                        {perm.replace("can_", "").replace("_", " ")}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-base italic">No special permissions</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="px-8 pb-8 mt-auto flex gap-4">
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="cursor-pointer flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-4 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] group-hover:translate-y-[-2px]"
              >
                Delete User
              </button>

              <button
                onClick={() => openFeedbackAsUser(user)}
                className="cursor-pointer flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-4 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] group-hover:translate-y-[-2px]"
              >
                Feedback as User
              </button>
            </div>
          </div>
        );
      })}
    </div>
  )}
</main>
    </div>
  );
}