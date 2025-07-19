const API_BASE = "https://workout-treat-backend.netlify.app/.netlify/functions";

interface UserData {
  localId: string;
  idToken: string;
  email: string;
  displayName?: string;
  isNewUser?: boolean;
  // add any other fields you expect here
}

interface ApiErrorResponse {
  error?: string;
}

export const loginUser = async (
  email: string,
  password: string
): Promise<UserData> => {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data: UserData & ApiErrorResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
};

export const registerUser = async (
  email: string,
  password: string,
  displayName: string
): Promise<UserData> => {
  const response = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, displayName }),
  });

  const data: UserData & ApiErrorResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data;
};

export const googleSignIn = async (idToken: string): Promise<UserData> => {
  const response = await fetch(`${API_BASE}/google-signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  const data: UserData & ApiErrorResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Google sign-in failed");
  }

  return data;
};

export const deleteAccount = async (
  userId: string,
  idToken: string
): Promise<any> => {
  const response = await fetch(`${API_BASE}/delete-account`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ userId, idToken }),
  });

  const data: ApiErrorResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Account deletion failed");
  }

  return data;
};
