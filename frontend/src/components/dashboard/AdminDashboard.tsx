import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import UserCreationChart from "@/components/UserCreationChart";
import { useDashboardStats } from "@/hooks/useDashboard";
import {
  UsersGroupIcon,
  ConversationIcon,
  MessagesIcon,
  ProfileCardIcon,
  TrendingUpIcon,
} from "@/components/icons";
import { StatCardSkeleton, getGreeting } from "./DashboardShared";

export default function AdminDashboard() {
  const { stats, trendData, loading, trendLoading, refetchTrend } =
    useDashboardStats();
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Super Admin";

  const defaultEnd = new Date().toISOString().split("T")[0];
  const defaultStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  const handleApplyFilters = () => {
    refetchTrend(startDate, endDate);
  };

  const adminStatCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      subtitle: "Registered accounts",
      icon: <UsersGroupIcon />,
      gradient: "from-emerald-500/15 to-teal-500/15",
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Total Conversations",
      value: stats?.totalConversations ?? 0,
      subtitle: "Platform-wide",
      icon: <ConversationIcon />,
      gradient: "from-violet-500/15 to-purple-500/15",
      iconBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    {
      title: "Total Messages",
      value: stats?.totalMessages ?? 0,
      subtitle: "Across all chats",
      icon: <MessagesIcon />,
      gradient: "from-sky-500/15 to-blue-500/15",
      iconBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* ── Greeting Header ── */}
      <div className="space-y-1">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          {getGreeting()},{" "}
          <span className="bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
            {userName}
          </span>
        </h2>
        <p className="text-muted-foreground text-base">
          Here's an overview of your platform's activity.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid gap-4 md:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
          : adminStatCards.map((card) => (
              <Card
                key={card.title}
                className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div
                    className={`h-10 w-10 rounded-xl ${card.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                  >
                    {card.icon}
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold tracking-tight">
                    {card.value.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.subtitle}
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* ── User Creation Trend ── */}
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUpIcon className="h-5 w-5 text-violet-500" />
              User Registrations
            </CardTitle>
            <CardDescription>
              New user accounts created over time
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-muted/50 rounded-md p-1 border">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-sm p-1 rounded focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <span className="text-muted-foreground text-sm">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-sm p-1 rounded focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <button
              onClick={handleApplyFilters}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4 py-2 rounded-md transition-colors"
            >
              Apply Changes
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {trendLoading ? (
            <div className="h-[320px] w-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Loading chart…</p>
              </div>
            </div>
          ) : trendData.length === 0 ? (
            <div className="h-[320px] w-full flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <UserCreationChart data={trendData} />
          )}
        </CardContent>
      </Card>

      {/* ── Admin Quick Actions ── */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Management</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <button
            onClick={() => navigate("/admin/users")}
            className="group relative overflow-hidden rounded-xl border bg-card p-6 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                <UsersGroupIcon />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Manage Users</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  View, create, edit, and remove user accounts.
                </p>
              </div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 transition-all duration-300 group-hover:text-foreground group-hover:translate-x-1">
              <TrendingUpIcon className="h-5 w-5" />
            </div>
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="group relative overflow-hidden rounded-xl border bg-card p-6 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                <ProfileCardIcon />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">My Profile</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  View and update your account details.
                </p>
              </div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 transition-all duration-300 group-hover:text-foreground group-hover:translate-x-1">
              <TrendingUpIcon className="h-5 w-5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
