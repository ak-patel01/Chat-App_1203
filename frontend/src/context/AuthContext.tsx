import { createContext, useContext, useState, type ReactNode } from "react";
// import { useNavigate } from "react-router-dom"; // Not used here yet
// import { type AuthResponse } from "@/services/api"; // Not used here yet

type User = {
    name: string;
    email: string;
    userType: string;
    role: string;
} | null;

interface AuthContextType {
    user: User;
    token: string | null;
    login: (token: string, refreshToken: string, userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(() => {
        const storedUserType = localStorage.getItem("userType");
        const storedRole = localStorage.getItem("role");
        if (storedUserType && storedRole) {
            return {
                name: "User", // Placeholder without decoding
                email: "",
                userType: storedUserType,
                role: storedRole
            };
        }
        return null;
    });
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

    const login = (newToken: string, refreshToken: string, userData: User) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("refreshToken", refreshToken);
        if (userData) {
            localStorage.setItem("userType", userData.userType);
            localStorage.setItem("role", userData.role);
            setUser(userData);
            setToken(newToken);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userType");
        localStorage.removeItem("role");
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
