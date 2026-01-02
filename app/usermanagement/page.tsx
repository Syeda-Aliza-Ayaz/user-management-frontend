// "use client";

// import { useEffect, useState } from "react";
// import { apiFetch, getCSRFToken } from "../../lib/api";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import Link from "next/link";

// type User = {
//   id: string;
//   email: string;
//   name: string;
//   role: string;
//   permissions: string[];
// };

// export default function UserManagement() {
//   const [user, setUser] = useState<User | null>(null);
//   const [users, setUsers] = useState<User[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     apiFetch("/me/").then(async (res) => {
//       if (res.ok) {
//         const currentUser = await res.json();
//         setUser(currentUser);

//         if (currentUser.permissions.includes("can_view_users")) {
//           const usersRes = await apiFetch("/users/");
//           console.log("Users response status:", usersRes.status);
//           if (usersRes.ok) {
//             const usersData = await usersRes.json();
//             console.log("Users data:", usersData);
//             setUsers(usersData);
//           } else {
//             const err = await usersRes.json();
//             console.error("Failed to fetch users:", err);
//             toast.error("Failed to fetch users");
//           }
//         }
//       }
//     });
//   }, []);


//   // Logout
//   const handleLogout = async () => {
//     await apiFetch("/logout/", { method: "POST" });
//     toast.success("Logged out");
//     router.push("/login");
//   };

//   const handleDeleteUser = async (userId: string) => {
//     if (!user?.permissions.includes("can_delete_users")) {
//       toast.error("You don't have permission to delete users");
//       return;
//     }

//     const targetUser = users.find(u => u.id === userId);
//     if (!targetUser) {
//       toast.error("User not found");
//       return;
//     }

//     if (user.id === userId) {
//       toast.error("You cannot delete yourself!");
//       return;
//     }

//     if (targetUser.role === "admin") {
//       toast.error("You cannot delete an admin!");
//       return;
//     }

//     const csrfToken = await getCSRFToken();
//     const res = await apiFetch(`/users/${userId}/`, {
//       method: "DELETE",
//       headers: { "X-CSRFToken": csrfToken },
//     });

//     if (res.ok) {
//       toast.success("User deleted!");
//       setUsers(users.filter((u) => u.id !== userId));
//     } else {
//       const err = await res.json();
//       toast.error(err.detail || "Failed to delete user");
//     }
//   };


//   return (
//     <div className="min-h-screen flex flex-col items-center p-8 bg-gray-50">
//       <div className="flex gap-3 mb-5">
//         <button
//           onClick={handleLogout}
//           className="cursor-pointer bg-black text-white text-lg px-5 py-3 rounded hover:bg-white hover:text-black border border-transparent hover:border-black transition-all duration-300"
//         >
//           Log out
//         </button>

//         <Link href="/">
//           <button className="cursor-pointer bg-black text-white text-lg px-5 py-3 rounded hover:bg-white hover:text-black border border-transparent hover:border-black transition-all duration-300">
//             Back to Home
//           </button>
//         </Link>
//       </div>

//       <h1 className="text-2xl mb-6">
//         Welcome, <span className="text-blue-600">{user?.name}</span>
//       </h1>

//       {(user?.permissions.includes("can_view_users") || user?.permissions.includes("can_delete_users")) && (
//         <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold mb-4">All Users</h2>
//           {users.length ? (
//             <ul>
//               {users.map((u) => (
//                 <li key={u.id} className="flex justify-between mb-2 items-center">
//                   <span>
//                     {u.name} ({u.email})
//                   </span>

//                   {user.permissions.includes("can_delete_users") && u.id !== user.id && (
//                     <button
//                       onClick={() => handleDeleteUser(u.id)}
//                       className="cursor-pointer bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition-all duration-300"
//                     >
//                       Delete
//                     </button>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No users found.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
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
//   role: string; // "admin" or "user"
//   department?: string;     
//   purseNumber?: string;
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

//         if (me.permissions.includes("can_view_users") || me.role == 'admin') {
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

//     // Prevent self-deletion
//     if (userId === currentUser.id) {
//       toast.error("You cannot delete yourself!");
//       return;
//     }

//     // Prevent deleting any admin (role === "admin")
//     if (targetUser.role === "admin") {
//       toast.error("You cannot delete an admin user!");
//       return;
//     }

//     if (!confirm(`Are you sure you want to delete ${targetUser.name}? This action cannot be undone.`)) {
//       return;
//     }

//     const csrfToken = await getCSRFToken();
//     const res = await apiFetch(`/users/${userId}/`, {
//       method: "DELETE",
//       headers: { "X-CSRFToken": csrfToken },
//     });

//     if (res.ok) {
//       toast.success(`${targetUser.name} has been deleted`);
//       setUsers(users.filter((u) => u.id !== userId));
//     } else {
//       toast.error("Failed to delete user");
//     }
//   };

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="text-center py-20">
//           <div className="text-navy text-xl">Loading users...</div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   // Add this check after loading
//   if (!currentUser?.permissions.includes("can_view_users") && currentUser?.role !== "admin") {
//     return (
//       <DashboardLayout>
//         <div className="max-w-4xl mx-auto text-center py-20">
//           <div className="text-navy text-2xl font-semibold mb-4">
//             Access Denied
//           </div>
//           <p className="text-navy/70 text-lg">
//             You don&apos;t have permission to view this page.
//           </p>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="max-w-6xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-primary-100">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-primary-50 to-accent-50 p-6 border-b border-primary-100">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//               <div>
//                 <h2 className="text-3xl font-bold text-navy">User Management</h2>
//                 <p className="text-navy/70 mt-1">View and manage system users</p>
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by name or email..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="cursor-text px-5 py-3 rounded-xl border border-primary-200 focus:border-primary focus:ring-4 focus:ring-primary-100 outline-none transition w-full sm:w-80"
//               />
//             </div>
//           </div>

//           {/* Table */}
//           {filteredUsers.length === 0 ? (
//             <div className="p-16 text-center">
//               <p className="text-navy/60 text-lg">
//                 {searchTerm ? "No users match your search." : "No users found in the system."}
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-navy/5">
//                   <tr>
//                     <th className="px-8 py-5 text-left text-sm font-semibold text-navy">Name</th>
//                     <th className="px-8 py-5 text-left text-sm font-semibold text-navy">Email</th>
//                     <th className="px-8 py-5 text-left text-sm font-semibold text-navy">Role</th>
//                     <th className="px-8 py-5 text-left text-sm font-semibold text-navy">Permissions</th>
//                     <th className="px-8 py-5 text-center text-sm font-semibold text-navy">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-primary-100">
//                   {filteredUsers.map((user) => {
//                     const canDeleteThisUser =
//                       (currentUser?.role === "admin" || currentUser?.permissions.includes("can_delete_users")) &&
//                       user.id !== currentUser?.id &&
//                       user.role !== "admin";

//                     return (
//                       <tr key={user.id} className="hover:bg-primary-50/30 transition">
//                         <td className="px-8 py-6 font-medium text-navy">{user.name}</td>
//                         <td className="px-8 py-6 text-navy/80">{user.email}</td>
//                         <td className="px-8 py-6">
//                           <span
//                             className={`inline-block px-4 py-1.5 text-xs font-bold rounded-full ${user.role === "admin"
//                               ? "bg-navy text-white"
//                               : "bg-accent-100 text-accent-800"
//                               }`}
//                           >
//                             {user.role.toUpperCase()}
//                           </span>
//                         </td>
//                         <td className="px-8 py-6">
//                           {user.permissions.length > 0 ? (
//                             <div className="flex flex-wrap gap-2">
//                               {user.permissions.map((perm) => (
//                                 <span
//                                   key={perm}
//                                   className="inline-block px-3 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full"
//                                 >
//                                   {perm.replace("can_", "").replace("_", " ")}
//                                 </span>
//                               ))}
//                             </div>
//                           ) : (
//                             <span className="text-navy/50 text-sm italic">No permissions</span>
//                           )}
//                         </td>
//                         <td className="px-8 py-6 text-center">
//                           {canDeleteThisUser ? (
//                             <button
//                               onClick={() => handleDeleteUser(user.id)}
//                               className="cursor-pointer bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2 rounded-lg shadow hover:shadow-md transform hover:-translate-y-0.5 transition"
//                             >
//                               Delete
//                             </button>
//                           ) : (
//                             <span className="text-navy/40 text-sm">
//                               {user.role === "admin" ? "Protected" : "—"}
//                             </span>
//                           )}
//                           {currentUser?.role === "admin" && (
//                             <button
//                               onClick={() => {
//                                 const feedbackUrl = `http://localhost:3000/?name=${encodeURIComponent(
//                                   user.name
//                                 )}&department=${encodeURIComponent(
//                                   user.department || "CSIT" 
//                                 )}&purseNumber=${encodeURIComponent(
//                                   user.purseNumber || "12345678" 
//                                 )}`;

//                                 window.open(feedbackUrl, "_blank");
//                               }}
//                               className="cursor-pointer bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2 rounded-lg shadow hover:shadow-md transform hover:-translate-y-0.5 transition ml-2"
//                             >
//                               Feedback as User
//                             </button>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { apiFetch, getCSRFToken } from "@/lib/api";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";

type User = {
  id: string;
  email: string;
  name: string;
  permissions: string[];
  role: string; // "admin" or "user"
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
    if (!currentUser?.permissions.includes("can_delete_users")) {
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

    if (!confirm(`Are you sure you want to delete ${targetUser.name}? This action cannot be undone.`)) {
      return;
    }

    const csrfToken = await getCSRFToken();
    const res = await apiFetch(`/users/${userId}/`, {
      method: "DELETE",
      headers: { "X-CSRFToken": csrfToken },
    });

    if (res.ok) {
      toast.success(`${targetUser.name} has been deleted`);
      setUsers(users.filter((u) => u.id !== userId));
    } else {
      toast.error("Failed to delete user");
    }
  };

  const openFeedbackAsUser = (user: User) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL || "http://localhost:3000";

    const params = new URLSearchParams();
    params.append("name", user.name);

    if (user.department) {
      params.append("department", user.department);
    }
    if (user.purse_number) {
      params.append("purseNumber", user.purse_number);
    }

    const feedbackUrl = `${baseUrl}?${params.toString()}`;
    window.open(feedbackUrl, "_blank");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <div className="text-navy text-xl">Loading users...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!currentUser?.permissions.includes("can_view_users") && currentUser?.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="text-navy text-2xl font-semibold mb-4">
            Access Denied
          </div>
          <p className="text-navy/70 text-lg">
            You don&apos;t have permission to view this page.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-primary-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 p-6 border-b border-primary-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold text-navy">User Management</h2>
                <p className="text-navy/70 mt-1">View and manage system users</p>
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="cursor-text px-5 py-3 rounded-xl border border-primary-200 focus:border-primary focus:ring-4 focus:ring-primary-100 outline-none transition w-full sm:w-80"
              />
            </div>
          </div>

          {/* Table */}
          {filteredUsers.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-navy/60 text-lg">
                {searchTerm ? "No users match your search." : "No users found in the system."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-navy/5">
                  <tr>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-navy">Name</th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-navy">Email</th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-navy">Role</th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-navy">Permissions</th>
                    <th className="px-8 py-5 text-center text-sm font-semibold text-navy">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-100">
                  {filteredUsers.map((user) => {
                    const canDeleteThisUser =
                      (currentUser?.role === "admin" || currentUser?.permissions.includes("can_delete_users")) &&
                      user.id !== currentUser?.id &&
                      user.role !== "admin";

                    const canFeedbackAsUser =
                      currentUser?.role === "admin" && user.role !== "admin";

                    return (
                      <tr key={user.id} className="hover:bg-primary-50/30 transition">
                        <td className="px-8 py-6 font-medium text-navy">{user.name}</td>
                        <td className="px-8 py-6 text-navy/80">{user.email}</td>
                        <td className="px-8 py-6">
                          <span
                            className={`inline-block px-4 py-1.5 text-xs font-bold rounded-full ${
                              user.role === "admin"
                                ? "bg-navy text-white"
                                : "bg-accent-100 text-accent-800"
                            }`}
                          >
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          {user.permissions.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {user.permissions.map((perm) => (
                                <span
                                  key={perm}
                                  className="inline-block px-3 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full"
                                >
                                  {perm.replace("can_", "").replace("_", " ")}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-navy/50 text-sm italic">No permissions</span>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-center gap-3">
                            {canDeleteThisUser ? (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2 rounded-lg shadow hover:shadow-md transition"
                              >
                                Delete
                              </button>
                            ) : (
                              <span className="text-navy/40 text-sm">
                                {user.role === "admin" ? "Protected" : "—"}
                              </span>
                            )}

                            {canFeedbackAsUser && (
                              <button
                                onClick={() => openFeedbackAsUser(user)}
                                className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-lg shadow hover:shadow-md transition"
                              >
                                Feedback as User
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}