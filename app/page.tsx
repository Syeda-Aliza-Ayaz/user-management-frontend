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
  const [submittedServices, setSubmittedServices] = useState<Record<string, string[]>>({});

  useEffect(() => {
    apiFetch("/users/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        // Fetch submitted services for each user
        return Promise.all(
          data.map((user: User) => 
            user.purse_number 
              ? fetchSubmittedServices(user.purse_number)
              : Promise.resolve({ purseNumber: user.purse_number, submitted: [] })
          )
        );
      })
      .then((submissions) => {
        const submissionsMap: Record<string, string[]> = {};
        submissions.forEach((sub) => {
          if (sub.purseNumber) {
            submissionsMap[sub.purseNumber] = sub.submitted;
          }
        });
        setSubmittedServices(submissionsMap);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Could not load users");
      })
      .finally(() => setLoading(false));
  }, []);

  const fetchSubmittedServices = async (purseNumber: string): Promise<{ purseNumber: string; submitted: string[] }> => {
    try {
      const feedbackBaseUrl = process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL || "http://localhost:3000";
      const response = await fetch(`${feedbackBaseUrl}/api/check-submissions?purseNumber=${encodeURIComponent(purseNumber)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      if (response.ok) {
        const data = await response.json();
        return { purseNumber, submitted: data.submittedDepts || [] };
      }
    } catch (error) {
      console.error(`Error fetching submissions for ${purseNumber}:`, error);
    }
    return { purseNumber, submitted: [] };
  };

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

  const openServiceFeedback = (user: User, service: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL || "http://localhost:3000";

    const params = new URLSearchParams();
    params.append("name", user.name);
    if (user.department) params.append("department", user.department);
    if (user.purse_number) params.append("purseNumber", user.purse_number);
    params.append("service", service);

    window.open(`${baseUrl}?${params.toString()}`, "_blank");
  };

  const isServiceSubmitted = (user: User, serviceKey: string): boolean => {
    if (!user.purse_number) return false;
    const submitted = submittedServices[user.purse_number] || [];
    return submitted.includes(serviceKey);
  };

  const getServiceKey = (serviceName: string): string => {
    const serviceMapping: Record<string, string> = {
      "Cafeteria Service": "cafeteria",
      "Department of Student Affairs": "student_affairs",
      "Transport Service": "transport",
      "Library Service": "library",
      "Registrar Service": "registrar",
      "IT Service": "it_services"
    };
    return serviceMapping[serviceName] || "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-2xl font-medium text-gray-900">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 md:px-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">User Directory</h1>
              <p className="text-gray-600 mt-1 text-sm">Manage and view all registered users</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{filteredUsers.length}</span>
              <span>user{filteredUsers.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-6 py-6 md:px-12">
        <div className="max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email, department or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder-gray-400 text-gray-900 shadow-sm"
            />
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Users Grid */}
<main className="max-w-7xl mx-auto px-6 pb-16 md:px-12">
  {filteredUsers.length === 0 ? (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <p className="text-xl font-medium text-gray-700">
        {searchTerm ? "No matching users found" : "No users registered yet"}
      </p>
      <p className="text-gray-500 mt-1">{searchTerm ? "Try different keywords" : "The list is currently empty"}</p>
    </div>
  ) : (
    <div className="space-y-3">
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
            className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            {/* Main Row */}
            <div className="p-4 flex items-center gap-4">
              {/* Avatar */}
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-sm font-semibold text-white flex-shrink-0 shadow-sm">
                {initials}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {user.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                <div className="flex gap-3 mt-1.5 text-xs">
                  {user.department && (
                    <span className="inline-flex items-center gap-1 text-gray-600">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {user.department}
                    </span>
                  )}
                  {user.purse_number && (
                    <span className="inline-flex items-center gap-1 text-gray-600">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      {user.purse_number}
                    </span>
                  )}
                </div>
              </div>

              {/* Permissions */}
              <div className="hidden xl:flex items-center gap-2 max-w-xs">
                {user.permissions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {user.permissions.slice(0, 2).map((perm) => (
                      <span
                        key={perm}
                        className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded border border-blue-100"
                      >
                        {perm.replace("can_", "").replace("_", " ")}
                      </span>
                    ))}
                    {user.permissions.length > 2 && (
                      <span className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50 rounded border border-gray-200">+{user.permissions.length - 2}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="cursor-pointer bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 font-medium px-3 py-1.5 rounded-md text-xs transition-all"
                >
                  Delete
                </button>
                <button
                  onClick={() => openFeedbackAsUser(user)}
                  className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded-md text-xs transition-all shadow-sm"
                >
                  General Feedback
                </button>
              </div>
            </div>

            {/* Service Buttons Row */}
            <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <span className="text-xs font-semibold text-gray-700 whitespace-nowrap pt-1.5">Department Feedback:</span>
                <div className="flex gap-1.5 flex-wrap flex-1">
                  {[
                    { name: "Cafeteria Service", label: "Cafeteria", 
                      classes: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 hover:shadow-sm" },
                    { name: "Department of Student Affairs", label: "Student Affairs", 
                      classes: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 hover:shadow-sm" },
                    { name: "Transport Service", label: "Transport", 
                      classes: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 hover:border-sky-300 hover:shadow-sm" },
                    { name: "Library Service", label: "Library", 
                      classes: "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 hover:border-teal-300 hover:shadow-sm" },
                    { name: "Registrar Service", label: "Registrar", 
                      classes: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300 hover:shadow-sm" },
                    { name: "IT Service", label: "IT Service", 
                      classes: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300 hover:shadow-sm" }
                  ].map((service) => {
                    const serviceKey = getServiceKey(service.name);
                    const isSubmitted = isServiceSubmitted(user, serviceKey);
                    
                    return (
                      <button
                        key={service.name}
                        onClick={(e) => {
                          if (isSubmitted) {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                          }
                          openServiceFeedback(user, service.name);
                        }}
                        disabled={isSubmitted}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md border ${
                          isSubmitted
                            ? "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed opacity-60 pointer-events-none"
                            : `cursor-pointer transition-all ${service.classes}`
                        }`}
                        title={isSubmitted ? "✓ Feedback submitted" : `Submit feedback for ${service.label}`}
                      >
                        {isSubmitted && (
                          <span className="inline-block mr-1">
                            <svg className="w-3 h-3 inline" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                        {service.label}
                      </button>
                    );
                  })}
                </div>
              </div>
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