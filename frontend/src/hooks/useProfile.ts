import { useState, useEffect, useCallback } from "react";
import { userService, type UserDto, type UpdateProfileData } from "@/services/api";

export function useProfile() {
    const [profile, setProfile] = useState<UserDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userService.getProfile();
            setProfile(data);
        } catch (err) {
            setError("Failed to load profile");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const updateProfile = async (data: UpdateProfileData) => {
        setUpdating(true);
        setUpdateSuccess(false);
        setError(null);
        try {
            const updated = await userService.updateProfile(data);
            setProfile(updated);
            setUpdateSuccess(true);
            // Clear success message after 3 seconds
            setTimeout(() => setUpdateSuccess(false), 3000);
            return true;
        } catch (err) {
            setError("Failed to update profile");
            console.error(err);
            return false;
        } finally {
            setUpdating(false);
        }
    };

    return { profile, loading, error, updating, updateSuccess, updateProfile, refetch: fetchProfile };
}
