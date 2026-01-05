// // "use client";

// // import { useEffect, useState } from "react";
// // import { apiFetch, getCSRFToken } from "@/lib/api";
// // import toast from "react-hot-toast";
// // import DashboardLayout from "../components/DashboardLayout";

// // type User = {
// //   id: string;
// //   email: string;
// //   name: string;
// //   permissions: string[];
// //   role: string;
// //   department?: string;
// //   purse_number?: string;
// // };

// // export default function UserManagement() {
// //   const [users, setUsers] = useState<User[]>([]);
// //   const [currentUser, setCurrentUser] = useState<User | null>(null);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     apiFetch("/me/")
// //       .then((res) => res.json())
// //       .then((me) => {
// //         setCurrentUser(me);

// //         if (me.permissions.includes("can_view_users") || me.role === "admin") {
// //           return apiFetch("/users/");
// //         }
// //         throw new Error("No permission");
// //       })
// //       .then((res) => res.json())
// //       .then((data) => setUsers(data))
// //       .catch(() => toast.error("Failed to load users"))
// //       .finally(() => setLoading(false));
// //   }, []);

// //   const filteredUsers = users.filter(
// //     (user) =>
// //       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       user.email.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   const handleDeleteUser = async (userId: string) => {
// //     if (!currentUser?.permissions.includes("can_delete_users")) {
// //       toast.error("You don't have permission to delete users");
// //       return;
// //     }

// //     const targetUser = users.find((u) => u.id === userId);
// //     if (!targetUser) return;

// //     if (userId === currentUser.id) {
// //       toast.error("You cannot delete yourself!");
// //       return;
// //     }

// //     if (targetUser.role === "admin") {
// //       toast.error("You cannot delete an admin user!");
// //       return;
// //     }

// //     if (!confirm(`Are you sure you want to delete ${targetUser.name}? This action cannot be undone.`)) {
// //       return;
// //     }

// //     const csrfToken = await getCSRFToken();
// //     const res = await apiFetch(`/users/${userId}/`, {
// //       method: "DELETE",
// //       headers: { "X-CSRFToken": csrfToken },
// //     });

// //     if (res.ok) {
// //       toast.success(`${targetUser.name} has been deleted`);
// //       setUsers(users.filter((u) => u.id !== userId));
// //     } else {
// //       toast.error("Failed to delete user");
// //     }
// //   };

// //   const openFeedbackAsUser = (user: User) => {
// //     const baseUrl = process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL || "http://localhost:3000";

// //     const params = new URLSearchParams();
// //     params.append("name", user.name);
// //     if (user.department) params.append("department", user.department);
// //     if (user.purse_number) params.append("purseNumber", user.purse_number);

// //     const feedbackUrl = `${baseUrl}?${params.toString()}`;
// //     window.open(feedbackUrl, "_blank");
// //   };

// //   if (loading) {
// //     return (
// //       <DashboardLayout>
// //         <div className="text-center py-20">
// //           <div className="text-black text-xl">Loading users...</div>
// //         </div>
// //       </DashboardLayout>
// //     );
// //   }

// //   if (!currentUser?.permissions.includes("can_view_users") && currentUser?.role !== "admin") {
// //     return (
// //       <DashboardLayout>
// //         <div className="max-w-4xl mx-auto text-center py-20">
// //           <div className="text-black text-2xl font-semibold mb-4">
// //             Access Denied
// //           </div>
// //           <p className="text-gray-600 text-lg">
// //             You don't have permission to view this page.
// //           </p>
// //         </div>
// //       </DashboardLayout>
// //     );
// //   }

// //   return (
// //     <DashboardLayout>
// //       <div className="max-w-6xl mx-auto">
// //         <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
// //           {/* Header */}
// //           <div className="p-8 border-b border-gray-200">
// //             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //               <div>
// //                 <h2 className="text-3xl font-bold text-black">User Management</h2>
// //                 <p className="text-gray-600 mt-1">View and manage system users</p>
// //               </div>
// //               <input
// //                 type="text"
// //                 placeholder="Search by name or email..."
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 className="cursor-text px-5 py-4 rounded-xl border border-gray-300 focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition w-full sm:w-80"
// //               />
// //             </div>
// //           </div>

// //           {/* Table */}
// //           {filteredUsers.length === 0 ? (
// //             <div className="p-16 text-center">
// //               <p className="text-gray-600 text-lg">
// //                 {searchTerm ? "No users match your search." : "No users found in the system."}
// //               </p>
// //             </div>
// //           ) : (
// //             <div className="overflow-x-auto">
// //               <table className="w-full">
// //                 <thead className="bg-gray-50">
// //                   <tr>
// //                     <th className="px-8 py-5 text-left text-sm font-semibold text-black">Name</th>
// //                     <th className="px-8 py-5 text-left text-sm font-semibold text-black">Email</th>
// //                     <th className="px-8 py-5 text-left text-sm font-semibold text-black">Role</th>
// //                     <th className="px-8 py-5 text-left text-sm font-semibold text-black">Permissions</th>
// //                     <th className="px-8 py-5 text-center text-sm font-semibold text-black">Actions</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-gray-200">
// //                   {filteredUsers.map((user) => {
// //                     const canDeleteThisUser =
// //                       (currentUser?.role === "admin" || currentUser?.permissions.includes("can_delete_users")) &&
// //                       user.id !== currentUser?.id &&
// //                       user.role !== "admin";

// //                     const canFeedbackAsUser = currentUser?.role === "admin" && user.role !== "admin";

// //                     return (
// //                       <tr key={user.id} className="hover:bg-gray-50 transition">
// //                         <td className="px-8 py-6 font-medium text-black">{user.name}</td>
// //                         <td className="px-8 py-6 text-gray-700">{user.email}</td>
// //                         <td className="px-8 py-6">
// //                           <span
// //                             className={`inline-block px-4 py-1.5 text-xs font-bold rounded-full ${
// //                               user.role === "admin"
// //                                 ? "bg-black text-white"
// //                                 : "bg-gray-200 text-gray-800"
// //                             }`}
// //                           >
// //                             {user.role.toUpperCase()}
// //                           </span>
// //                         </td>
// //                         <td className="px-8 py-6">
// //                           {user.permissions.length > 0 ? (
// //                             <div className="flex flex-wrap gap-2">
// //                               {user.permissions.map((perm) => (
// //                                 <span
// //                                   key={perm}
// //                                   className="inline-block px-3 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded-full"
// //                                 >
// //                                   {perm.replace("can_", "").replace("_", " ")}
// //                                 </span>
// //                               ))}
// //                             </div>
// //                           ) : (
// //                             <span className="text-gray-500 text-sm italic">No permissions</span>
// //                           )}
// //                         </td>
// //                         <td className="px-8 py-6">
// //                           <div className="flex items-center justify-center gap-3">
// //                             {canDeleteThisUser && (
// //                               <button
// //                                 onClick={() => handleDeleteUser(user.id)}
// //                                 className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg shadow hover:shadow-md transition"
// //                               >
// //                                 Delete
// //                               </button>
// //                             )}

// //                             {canFeedbackAsUser && (
// //                               <button
// //                                 onClick={() => openFeedbackAsUser(user)}
// //                                 className="bg-black hover:bg-gray-800 text-white font-medium px-5 py-2 rounded-lg shadow hover:shadow-md transition"
// //                               >
// //                                 Feedback as User
// //                               </button>
// //                             )}

// //                             {!canDeleteThisUser && !canFeedbackAsUser && (
// //                               <span className="text-gray-500 text-sm">
// //                                 {user.role === "admin" ? "Protected" : "—"}
// //                               </span>
// //                             )}
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </DashboardLayout>
// //   );
// // }
// "use client";

// import { useEffect, useState } from "react";
// import { apiFetch, getCSRFToken } from "@/lib/api";
// import toast from "react-hot-toast";
// import DashboardLayout from "../components/DashboardLayout";

// type User = {
//   id: string;
//   email: string;
//   name: string;
//   permissions: string[];
//   role: string;
//   department?: string;
//   purse_number?: string;
// };

// export default function UserManagement() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     apiFetch("/me/")
//       .then((res) => res.json())
//       .then((me) => {
//         setCurrentUser(me);

//         if (me.permissions.includes("can_view_users") || me.role === "admin") {
//           return apiFetch("/users/");
//         }
//         throw new Error("No permission");
//       })
//       .then((res) => res.json())
//       .then((data) => setUsers(data))
//       .catch(() => toast.error("Failed to load users"))
//       .finally(() => setLoading(false));
//   }, []);

//   const filteredUsers = users.filter(
//     (user) =>
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleDeleteUser = async (userId: string) => {
//     if (!currentUser?.permissions.includes("can_delete_users")) {
//       toast.error("You don't have permission to delete users");
//       return;
//     }

//     const targetUser = users.find((u) => u.id === userId);
//     if (!targetUser) return;

//     if (userId === currentUser.id) {
//       toast.error("You cannot delete yourself!");
//       return;
//     }

//     if (targetUser.role === "admin") {
//       toast.error("You cannot delete an admin user!");
//       return;
//     }

//     if (!confirm(`Are you sure you want to delete ${targetUser.name}?`)) return;

//     const csrfToken = await getCSRFToken();
//     const res = await apiFetch(`/users/${userId}/`, {
//       method: "DELETE",
//       headers: { "X-CSRFToken": csrfToken },
//     });

//     if (res.ok) {
//       toast.success(`${targetUser.name} deleted`);
//       setUsers(users.filter((u) => u.id !== userId));
//     } else {
//       toast.error("Failed to delete user");
//     }
//   };

//   const openFeedbackAsUser = (user: User) => {
//     const baseUrl = process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL || "http://localhost:3000";

//     const params = new URLSearchParams();
//     params.append("name", user.name);
//     if (user.department) params.append("department", user.department);
//     if (user.purse_number) params.append("purseNumber", user.purse_number);

//     window.open(`${baseUrl}?${params.toString()}`, "_blank");
//   };

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="text-center py-20">
//           <p className="text-black text-xl">Loading users...</p>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (!currentUser?.permissions.includes("can_view_users") && currentUser?.role !== "admin") {
//     return (
//       <DashboardLayout>
//         <div className="max-w-4xl mx-auto text-center py-20">
//           <h2 className="text-black text-2xl font-semibold mb-4">Access Denied</h2>
//           <p className="text-gray-600 text-lg">You don't have permission to view this page.</p>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Header + Search */}
//         <div className="mb-10">
//           <h2 className="text-3xl font-bold text-black mb-2">User Management</h2>
//           <p className="text-gray-600 mb-6">View and manage system users</p>

//           <input
//             type="text"
//             placeholder="Search by name or email..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full max-w-lg px-6 py-4 rounded-xl border border-gray-300 focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition text-black placeholder-gray-500"
//           />
//         </div>

//         {/* Users Grid */}
//         {filteredUsers.length === 0 ? (
//           <div className="text-center py-20">
//             <p className="text-gray-600 text-lg">
//               {searchTerm ? "No users match your search." : "No users found in the system."}
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredUsers.map((user) => {
//               const canDelete = 
//                 (currentUser?.role === "admin" || currentUser?.permissions.includes("can_delete_users")) &&
//                 user.id !== currentUser?.id &&
//                 user.role !== "admin";

//               const canFeedback = currentUser?.role === "admin" && user.role !== "admin";

//               return (
//                 <div
//                   key={user.id}
//                   className="bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col h-full"
//                 >
//                   <div className="p-8 flex-1">
//                     <div className="flex items-start justify-between mb-4">
//                       <div>
//                         <h3 className="text-xl font-bold text-black">{user.name}</h3>
//                         <p className="text-gray-600">{user.email}</p>
//                       </div>
//                       <span
//                         className={`px-4 py-1.5 text-xs font-bold rounded-full ${
//                           user.role === "admin"
//                             ? "bg-black text-white"
//                             : "bg-gray-200 text-gray-800"
//                         }`}
//                       >
//                         {user.role.toUpperCase()}
//                       </span>
//                     </div>

//                     <div className="mt-6">
//                       <p className="text-sm font-medium text-gray-700 mb-2">Permissions:</p>
//                       {user.permissions.length > 0 ? (
//                         <div className="flex flex-wrap gap-2">
//                           {user.permissions.map((perm) => (
//                             <span
//                               key={perm}
//                               className="px-3 py-1 text-xs bg-gray-200 text-gray-800 rounded-full"
//                             >
//                               {perm.replace("can_", "").replace("_", " ")}
//                             </span>
//                           ))}
//                         </div>
//                       ) : (
//                         <p className="text-gray-500 text-sm italic">None</p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Action Buttons at Bottom */}
//                   <div className="p-6 pt-0 mt-auto border-t border-gray-200">
//                     <div className="flex gap-3">
//                       {canDelete && (
//                         <button
//                           onClick={() => handleDeleteUser(user.id)}
//                           className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl shadow hover:shadow-md transition"
//                         >
//                           Delete
//                         </button>
//                       )}

//                       {canFeedback && (
//                         <button
//                           onClick={() => openFeedbackAsUser(user)}
//                           className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-xl shadow hover:shadow-md transition"
//                         >
//                           Feedback as User
//                         </button>
//                       )}

//                       {!canDelete && !canFeedback && (
//                         <p className="text-center text-gray-500 text-sm w-full py-3">
//                           {user.role === "admin" ? "Protected" : "No actions"}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { apiFetch, getCSRFToken } from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

type User = {
  id: string;
  email: string;
  name: string;
  permissions: string[];
  role: string;
  department?: string;
  purse_number?: string;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/me/")
      .then((res) => res.json())
      .then((me) => {
        setCurrentUser(me);
        if (me.permissions.includes("can_view_users") || me.role === "admin") {
          return apiFetch("/users/");
        }
        throw new Error("No permission");
      })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = async (userId: string) => {
    console.log(currentUser?.role)
    console.log(currentUser?.permissions.includes("can_delete_users"))
    if (!currentUser?.permissions.includes("can_delete_users") && !(currentUser?.role == "admin")) {
      toast.error("You don't have permission to delete users");
      return;
    }

    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;

    if (userId === currentUser.id) {
      toast.error("You cannot delete yourself!");
      return;
    }

    if (targetUser.role === "admin") {
      toast.error("You cannot delete an admin user!");
      return;
    }

    if (!confirm(`Delete ${targetUser.name}? This action cannot be undone.`)) return;

    const csrfToken = await getCSRFToken();
    const res = await apiFetch(`/users/${userId}/`, {
      method: "DELETE",
      headers: { "X-CSRFToken": csrfToken },
    });

    if (res.ok) {
      toast.success("User deleted successfully");
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black text-xl">Loading users...</p>
      </div>
    );
  }

  if (!currentUser?.permissions.includes("can_view_users") && currentUser?.role !== "admin") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Access Denied</h2>
          <p className="text-gray-600 text-lg">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">User Management</h1>
            <p className="text-gray-600 mt-1">View and manage system users</p>
          </div>
          <Link
            href="/"
            className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Search */}
      {/* <div className="px-25 py-5">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-8 py-3 text-lg rounded-2xl border border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black/10 transition placeholder-gray-500"
        />
      </div> */}

      {/* Search */}
      <div className="px-8 py-5">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email, department, or purse number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-8 py-4 text-lg rounded-3xl border border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black/10 transition placeholder-gray-500"
            />
            {/* Search Icon */}
            <svg
              className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Users Cards */}
      <div className="max-w-7xl mx-auto px-8 pb-12">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-xl">
              {searchTerm ? "No users match your search" : "No users found"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => {
              const initials = user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              const canDelete =
                (currentUser?.role === "admin" || currentUser?.permissions.includes("can_delete_users")) &&
                user.id !== currentUser?.id &&
                user.role !== "admin";

              const canFeedback = currentUser?.role === "admin" && user.role !== "admin";

              return (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg hover:border-black transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-700">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-black truncate">{user.name}</h3>
                        <p className="text-gray-600 truncate">{user.email}</p>
                        {user.department && (
                          <p className="text-sm text-gray-500 mt-1 truncate">{user.department}</p>
                        )}
                        {user.purse_number && (
                          <p className="text-sm text-gray-500 truncate">{user.purse_number}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 flex gap-3">
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="cursor-pointer flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition"
                      >
                        Delete
                      </button>
                    )}

                    {canFeedback && (
                      <button
                        onClick={() => openFeedbackAsUser(user)}
                        className="cursor-pointer flex-1 bg-black hover:bg-gray-800 text-white py-3 rounded-xl transition"
                      >
                        Feedback as User
                      </button>
                    )}

                    {!canDelete && !canFeedback && (
                      <div className="flex-1 text-center text-gray-500 py-3">
                        {user.role === "admin" ? "Protected" : "No actions"}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}