import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "teacher" | "student";
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
  "admin@dcampus.com": {
    id: "1",
    name: "Dr. Mónica García",
    email: "admin@dcampus.com",
    role: "admin",
  },
  "teacher@dcampus.com": {
    id: "2",
    name: "Prof. Carlos López",
    email: "teacher@dcampus.com",
    role: "teacher",
  },
  "student@dcampus.com": {
    id: "3",
    name: "Ana Martínez",
    email: "student@dcampus.com",
    role: "student",
  },
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
    // Accept any email/password for demo
    const newUser: User = {
      id: "99",
      name: email.split("@")[0],
      email,
      role: "student",
    };
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
