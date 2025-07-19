const API_BASE = "https://workout-treat-backend.netlify.app/.netlify/functions";

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
};

export const registerUser = async (email, password, displayName) => {
  const response = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, displayName }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data;
};

export const googleSignIn = async (idToken) => {
  const response = await fetch(`${API_BASE}/google-signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Google sign-in failed");
  }

  return data;
};

export const deleteAccount = async (userId, idToken) => {
  const response = await fetch(`${API_BASE}/delete-account`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ userId, idToken }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Account deletion failed");
  }

  return data;
};
