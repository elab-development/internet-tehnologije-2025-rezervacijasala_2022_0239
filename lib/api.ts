// lib/api.ts

export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  // 1. Ovde pravimo prazne hedere ili uzimamo one koje si ti poslala
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // 2. AUTOMATSKI TRAŽIMO KORISNIKA
  // Ne čekamo da nam ga ti pošalješ, nego sami gledamo u localStorage
  // "auth_user" je ključ koji smo definisali u AuthContext-u
  const storedUser = localStorage.getItem("auth_user");

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      // Ako korisnik postoji, dodajemo ona dva ključna headera koja backend traži
      headers["x-user-id"] = String(user.id);
      //headers["x-user-role"] = user.role;
    } catch (e) {
      console.error("Greška pri čitanju korisnika iz localStorage", e);
    }
  }

  // 3. Šaljemo zahtev sa novim hederima
  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    // Neki odgovori nemaju JSON body, to je ok
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