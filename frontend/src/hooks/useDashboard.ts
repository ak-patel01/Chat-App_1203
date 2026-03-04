import { useState, useEffect } from "react";
import { dashboardService, type DashboardStats } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export function useDashboardStats() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [trendData, setTrendData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [trendLoading, setTrendLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            setLoading(true);
            try {
                if (user.userType === "SuperAdmin") {
                    const [statsData, trendRes] = await Promise.all([
                        dashboardService.getAdminStats(),
                        dashboardService.getAdminUserTrend()
                    ]);
                    setStats(statsData);
                    setTrendData(trendRes);
                } else {
                    const data = await dashboardService.getUserStats();
                    setStats(data);
                }
            } catch (err) {
                setError("Failed to fetch dashboard stats");
                console.error(err);
            } finally {
                setLoading(false);
                setTrendLoading(false);
            }
        };

        fetchStats();
    }, [user]);

    const refetchTrend = async (startDate: string, endDate: string) => {
        if (!user || user.userType !== "SuperAdmin") return;
        setTrendLoading(true);
        try {
            const trendRes = await dashboardService.getAdminUserTrend(startDate, endDate);
            setTrendData(trendRes);
        } catch (err) {
            console.error("Failed to refetch user creation trend", err);
        } finally {
            setTrendLoading(false);
        }
    };

    return { stats, trendData, loading, trendLoading, error, refetchTrend };
}
