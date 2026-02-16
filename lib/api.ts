
export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  // pravimo prazne hedere ili uzimamo one koji su poslati
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // automatski trazimo korisnika
  // "auth_user" je ključ koji smo definisali u AuthContext-u
  const storedUser = localStorage.getItem("auth_user");

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      headers["x-user-id"] = String(user.id);
    } catch (e) {
      console.error("Greška pri čitanju korisnika iz localStorage", e);
    }
  }

  // šaljemo zahtev sa novim hederima
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


/*api je most izmedju UI svijeta i backenda odnosno izmedju Reacta i API rute.
ovo je pomocnik obicnom fetch-u. automatski dodaje auth podatke, definise error handling, sprijecava ponavljanje koda.
Frontend poziva afiFetch koji onda pravi HTTP request (fetch) koji poziva neku api rutu-url
*/