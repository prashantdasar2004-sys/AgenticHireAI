const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("agentic_hire_token");
}

export function setToken(token) {
  window.localStorage.setItem("agentic_hire_token", token);
}

export function clearToken() {
  window.localStorage.removeItem("agentic_hire_token");
}

export async function api(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      headers,
    }
  );

  const text = await response.text();

  let payload = {};

  try {
    payload = text ? JSON.parse(text) : {};
  } catch (error) {
    console.error("Invalid JSON response:", text);
    throw new Error("Server returned invalid JSON");
  }

  if (!response.ok || !payload.success) {
    throw new Error(
      payload?.error?.message ||
      payload?.message ||
      "API request failed"
    );
  }

  return payload.data;
}