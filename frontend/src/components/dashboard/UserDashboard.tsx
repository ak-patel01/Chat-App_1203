import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/useDashboard";
import {
  ConversationIcon,
  UnreadIcon,
  ChatBubbleIcon,
  ProfileCardIcon,
  ArrowRightIcon,
} from "@/components/icons";
import { StatCardSkeleton, getGreeting } from "./DashboardShared";

export default function UserDashboard() {
  const { stats, loading } = useDashboardStats();
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";

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
    <div className="p-6 md:p-8 space-y-8">
      {/* ── Greeting Header ── */}
      <div className="space-y-1">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          {getGreeting()},{" "}
          <span className="bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
            {userName}
          </span>
        </h2>
        <p className="text-muted-foreground text-base">
          Here's what's happening with your chats today.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid gap-4 md:grid-cols-2">
        {loading
          ? Array.from({ length: 2 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
          : userStatCards.map((card) => (
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

      {/* ── Quick Actions ── */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Quick Actions</h3>
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
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 transition-all duration-300 group-hover:text-foreground group-hover:translate-x-1">
                <ArrowRightIcon />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Welcome Tip Card ── */}
      {!loading && (
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
