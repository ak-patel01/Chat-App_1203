import api from "@/api/axios";
import { type LoginFormValues, type RegisterFormValues } from "@/lib/schemas";

export interface DashboardStats {
    totalUsers?: number;
    totalConversations: number;
    totalMessages?: number;
    totalUnreadMessages?: number;
}

export interface TrendDataPoint {
    date: string;
    count: number;
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    name: string;
    email: string;
    userType: string;
    role: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export const authService = {
    login: async (data: LoginFormValues) => {
        const response = await api.post<AuthResponse>("/auth/login", data);
        return response.data;
    },
    register: async (data: Omit<RegisterFormValues, "confirmPassword">) => {
        // Backend expects specific fields, schema might have extra UI fields
        const response = await api.post<AuthResponse>("/auth/register", data);
        return response.data;
    },
    refresh: async (data: RefreshTokenRequest) => {
        const response = await api.post<AuthResponse>("/auth/refresh", data);
        return response.data;
    },
};

export const dashboardService = {
    getAdminStats: async () => {
        const response = await api.get<DashboardStats>("/dashboard/admin");
        return response.data;
    },
    getUserStats: async () => {
        const response = await api.get<DashboardStats>("/dashboard/user");
        return response.data;
    },
    getAdminUserTrend: async (startDate?: string, endDate?: string) => {
        let url = '/dashboard/admin/user-trend';
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        const qs = params.toString();
        if (qs) url += `?${qs}`;
        
        const response = await api.get<TrendDataPoint[]>(url);
        return response.data;
    }
};

export interface UserDto {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    userType: string;
    createdAt: string;
}

export interface UpdateProfileData {
    name: string;
    phoneNumber: string;
}

export interface CreateUserData {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    userType: string;
}

export interface AdminUpdateUserData {
    name: string;
    phoneNumber: string;
    userType: string;
}

export const userService = {
    getAll: async () => {
        const response = await api.get<UserDto[]>("/user");
        return response.data;
    },
    getProfile: async () => {
        const response = await api.get<UserDto>("/user/profile");
        return response.data;
    },
    updateProfile: async (data: UpdateProfileData) => {
        const response = await api.put<UserDto>("/user/profile", data);
        return response.data;
    },
    createUser: async (data: CreateUserData) => {
        const response = await api.post<UserDto>("/user", data);
        return response.data;
    },
    adminUpdateUser: async (id: string, data: AdminUpdateUserData) => {
        const response = await api.put<UserDto>(`/user/${id}`, data);
        return response.data;
    },
    deleteUser: async (id: string) => {
        const response = await api.delete(`/user/${id}`);
        return response.data;
    }
};
