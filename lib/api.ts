type AuthState = {
  user?: {
    id: number;
    role: string;
  };
};

export async function apiFetch(
  url: string,
  options: RequestInit = {},
  auth?: AuthState
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(auth?.user && {
      "x-user-id": String(auth.user.id),
      "x-user-role": auth.user.role,
    }),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data: any = null;
  try {
    data = await response.json();
  } catch {
  }

  if (!response.ok) {
    const message =
      data?.error ||
      data?.message ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
}
