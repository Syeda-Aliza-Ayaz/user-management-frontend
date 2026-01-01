const API_BASE = "https://user-management-backend.up.railway.app/api/accounts";

export async function apiFetch(url:string, options: RequestInit = {}) {
    return fetch(`${API_BASE}${url}`, { ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) }, credentials: "include", });
}

export async function getCSRFToken(){
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : "";
}