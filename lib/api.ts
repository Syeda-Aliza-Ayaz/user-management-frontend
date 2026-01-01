const API_BASE = "http://localhost:8000/api/accounts";

export async function apiFetch(url:string, options: RequestInit = {}) {
    return fetch(`${API_BASE}${url}`, { ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) }, credentials: "include", });
}

export async function getCSRFToken(){
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : "";
}