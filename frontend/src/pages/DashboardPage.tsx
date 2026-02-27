import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface DashboardStats {
  totalUsers?: number;
  totalConversations: number;
  totalMessages?: number;
  totalUnreadMessages?: number;
}

// ── SVG Icons ──────────────────────────────────────────────────────

const ConversationIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3a49.5 49.5 0 01-4.02-.163 2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
    />
  </svg>
);

const UnreadIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"
    />
  </svg>
);

const UsersGroupIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
    />
  </svg>
);

const MessagesIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
    />
  </svg>
);

const ChatBubbleIcon = () => (
  <svg
    className="h-8 w-8"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
    />
  </svg>
);

const ProfileCardIcon = () => (
  <svg
    className="h-8 w-8"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

// ── Skeleton loader ────────────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        <div className="h-10 w-10 bg-muted rounded-xl animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-16 bg-muted rounded animate-pulse mb-1" />
        <div className="h-3 w-32 bg-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}

// ── Greeting helper ────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// ── Main Component ─────────────────────────────────────────────────

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const userType = localStorage.getItem("userType");
  const userName = localStorage.getItem("userName") || "User";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const endpoint =
          userType === "SuperAdmin" ? "/dashboard/admin" : "/dashboard/user";
        const response = await api.get(endpoint);
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [userType]);

  const isAdmin = userType === "SuperAdmin";

  // ── Stat card config ─────────────────────────────────────────────

  const userStatCards = [
    {
      title: "Conversations",
      value: stats?.totalConversations ?? 0,
      subtitle: "Active chats",
      icon: <ConversationIcon />,
      gradient: "from-violet-500/15 to-purple-500/15",
      iconBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    {
      title: "Unread Messages",
      value: stats?.totalUnreadMessages ?? 0,
      subtitle: "Waiting for you",
      icon: <UnreadIcon />,
      gradient: "from-amber-500/15 to-orange-500/15",
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
  ];

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

  const statCards = isAdmin ? adminStatCards : userStatCards;

  // ── Quick actions for regular users ──────────────────────────────

  const quickActions = [
    {
      title: "Start Chatting",
      description: "Jump into your conversations and stay connected.",
      icon: <ChatBubbleIcon />,
      gradient: "from-violet-600 to-purple-600",
      onClick: () => navigate("/dashboard"),
    },
    {
      title: "My Profile",
      description: "Update your name, phone, and account details.",
      icon: <ProfileCardIcon />,
      gradient: "from-pink-500 to-rose-500",
      onClick: () => navigate("/profile"),
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* ── Greeting Header ─────────────────────────────────────── */}
      <div className="space-y-1">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          {getGreeting()},{" "}
          <span className="bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
            {userName}
          </span>
        </h2>
        <p className="text-muted-foreground text-base">
          {isAdmin
            ? "Here's an overview of your platform's activity."
            : "Here's what's happening with your chats today."}
        </p>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────── */}
      <div
        className={`grid gap-4 ${isAdmin ? "md:grid-cols-3" : "md:grid-cols-2"}`}
      >
        {loading
          ? Array.from({ length: isAdmin ? 3 : 2 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
          : statCards.map((card) => (
              <Card
                key={card.title}
                className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
              >
                {/* Gradient background accent */}
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

      {/* ── Quick Actions (User only) ───────────────────────────── */}
      {!isAdmin && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold tracking-tight">
            Quick Actions
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {quickActions.map((action) => (
              <button
                key={action.title}
                onClick={action.onClick}
                className="group relative overflow-hidden rounded-xl border bg-card p-6 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    {action.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground">
                      {action.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 transition-all duration-300 group-hover:text-foreground group-hover:translate-x-1">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Admin Quick Actions ──────────────────────────────────── */}
      {isAdmin && (
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
                  <h4 className="font-semibold text-foreground">
                    Manage Users
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    View, create, edit, and remove user accounts.
                  </p>
                </div>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 transition-all duration-300 group-hover:text-foreground group-hover:translate-x-1">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
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
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ── Welcome Tip Card (User only) ────────────────────────── */}
      {!isAdmin && !loading && (
        <Card className="border-dashed border-2 bg-gradient-to-br from-violet-500/5 to-purple-500/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-lg">💡</span> Getting Started
            </CardTitle>
            <CardDescription>
              This is your personal dashboard. Your conversations and unread
              messages are tracked here. Use the sidebar to navigate between
              pages.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
