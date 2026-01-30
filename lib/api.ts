const API_BASE = "https://roshaant1-feedback-portal.hf.space/api/accounts";
// const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/accounts';

export async function apiFetch(url:string, options: RequestInit = {}) {
    return fetch(`${API_BASE}${url}`, { ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) }, credentials: "include", });
}

export async function getCSRFToken(){
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : "";
}