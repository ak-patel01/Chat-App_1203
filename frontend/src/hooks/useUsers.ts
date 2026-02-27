import { useState, useEffect, useCallback } from "react";
import { userService, type UserDto, type CreateUserData, type AdminUpdateUserData } from "@/services/api";

export function useUsers() {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userService.getAll();
            setUsers(data);
        } catch (err) {
            setError("Failed to fetch users");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const createUser = async (data: CreateUserData): Promise<{ success: boolean; message?: string }> => {
        try {
            const newUser = await userService.createUser(data);
            setUsers(prev => [newUser, ...prev]);
            return { success: true };
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to create user";
            return { success: false, message: msg };
        }
    };

    const updateUser = async (id: string, data: AdminUpdateUserData): Promise<{ success: boolean; message?: string }> => {
        try {
            const updated = await userService.adminUpdateUser(id, data);
            setUsers(prev => prev.map(u => u.id === id ? updated : u));
            return { success: true };
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to update user";
            return { success: false, message: msg };
        }
    };

    const deleteUser = async (id: string) => {
        try {
            await userService.deleteUser(id);
            setUsers(prev => prev.filter(u => u.id !== id));
            return true;
        } catch (err) {
            console.error("Failed to delete user", err);
            return false;
        }
    };

    return { users, loading, error, refetch: fetchUsers, createUser, updateUser, deleteUser };
}
