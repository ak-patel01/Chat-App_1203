import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import {
  SunIcon,
  MoonIcon,
  DashboardIcon,
  UsersIcon,
  ProfileIcon,
  LogoutIcon,
  LogoIcon,
} from "@/components/icons";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resolvedTheme, toggleTheme } = useTheme();

  const userType = localStorage.getItem("userType");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const menuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: DashboardIcon,
      roles: ["SuperAdmin", "User"],
    },
    {
      title: "Manage Users",
      url: "/admin/users",
      icon: UsersIcon,
      roles: ["SuperAdmin"],
    },
    {
      title: "Profile",
      url: "/profile",
      icon: ProfileIcon,
      roles: ["SuperAdmin", "User"],
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => userType && item.roles.includes(userType),
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LogoIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-foreground">
                  Anexus Chat
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {userType}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {filteredMenuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.url}
                  onClick={() => navigate(item.url)}
                  tooltip={item.title}
                >
                  <button className="w-full cursor-pointer">
                    <item.icon />
                    <span>{item.title}</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleTheme}
              tooltip={resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
            >
              {resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />}
              <span>
                {resolvedTheme === "dark" ? "Dark Mode" : "Light Mode"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              tooltip="Logout"
            >
              <LogoutIcon className="text-destructive" />
              <span className="text-destructive">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
