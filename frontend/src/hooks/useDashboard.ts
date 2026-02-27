import { useState, useEffect } from "react";
import { dashboardService, type DashboardStats } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export function useDashboardStats() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const data = user.userType === "SuperAdmin"
                    ? await dashboardService.getAdminStats()
                    : await dashboardService.getUserStats();
                setStats(data);
            } catch (err) {
                setError("Failed to fetch dashboard stats");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user]);

    return { stats, loading, error };
}
