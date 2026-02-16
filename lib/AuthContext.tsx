"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

//typescript sablon za usera
type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "USER" | "MANAGER" | "ADMIN";
};
;
//definisemo sta auth context sve nudi ostatku aplikacije, kao neka opsta definicija ovih funkcija i typova
type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
};
//kreiramo globalni context koji je tipa AuthContext, znaci to je kao kanal kroz koji cemo deliti auth podatke
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/*odlucili smo da to gde user sacuvan oznacimo sa auth_user, a da ne bi svuda pisali auth_user, onda tu rijec tj taj string 
cuvamo u konstantu koju nazivamo storage_key, slicno kao kad smo pravili const PI=3.14
znaci ovo je samo kao dajemo naziv(definisemo) kljucu (key) za vrednost (value) koja se nalazi u local storageu*/
const STORAGE_KEY = "auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); //cuva usera

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []); 
  //na startu aplikacije ucita usera iz localne memorije browsera i to se desi tad samo jednom ([]) i poslije ne, a onda
  //tog usera kojeg je ucitao smjesta u state user. ovo nam znaci takdoje da kad god bi refreshovali stranicu da nam user ostane 
  //ucitan

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : prev));
  };
  //provider je "emiter" koji deli vrednost (value) svima ispod sebe, value je objekat koji sadrži user, isLoggedIn i funkcije.
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
/*useAuth() je custom hook (pomoćna funkcija) da lakše čitaš AuthContext.
  Umesto:
    const ctx = useContext(AuthContext)
  svuda po kodu,
  pišeš:
    const { user, logout } = useAuth()
  */

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth mora biti iskoriscen unutar AuthProvider");
  }
  return context;
}

/*AuthContext nema dodira sa backendom vec samo pomaze frontu da pamti stalno ko je ulogovan i da preko authcontexta
taj podatak bude dostupan svim drugim fajlovima u projektu*/