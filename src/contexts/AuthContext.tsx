import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "superadmin" | "admin" | "coordinator" | "teacher" | "student";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutionId?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Record<string, User> = {
  "super@dcampus.com": { id: "u0", name: "Super Admin", email: "super@dcampus.com", role: "superadmin" },
  "admin@dcampus.com": { id: "u1", name: "Dr. Mónica García", email: "admin@dcampus.com", role: "admin", institutionId: "inst1" },
  "teacher@dcampus.com": { id: "u2", name: "Prof. Carlos López", email: "teacher@dcampus.com", role: "teacher", institutionId: "inst1" },
  "coord@dcampus.com": { id: "u6", name: "Coord. Laura Vega", email: "coord@dcampus.com", role: "coordinator", institutionId: "inst1" },
  "student@dcampus.com": { id: "u3", name: "Ana Martínez", email: "student@dcampus.com", role: "student", institutionId: "inst1" },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("dcampus-user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, _password: string): Promise<boolean> => {
    const mockUser = MOCK_USERS[email];
    if (mockUser) {
      setUser(mockUser);
      localStorage.setItem("dcampus-user", JSON.stringify(mockUser));
      return true;
    }
    const newUser: User = { id: "99", name: email.split("@")[0], email, role: "student", institutionId: "inst1" };
    setUser(newUser);
    localStorage.setItem("dcampus-user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dcampus-user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
