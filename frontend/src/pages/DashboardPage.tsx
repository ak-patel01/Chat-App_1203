import { useAuth } from "@/context/AuthContext";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.userType === "SuperAdmin";

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
}
