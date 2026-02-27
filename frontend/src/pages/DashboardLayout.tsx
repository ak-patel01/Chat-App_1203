import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

// ── Sun Icon ────────────────────────────────────────────────────────
function SunIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

// ── Moon Icon ───────────────────────────────────────────────────────
function MoonIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// ── Hamburger Icon ──────────────────────────────────────────────────
function MenuIcon() {
  return (
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
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}

// ── Close Icon ──────────────────────────────────────────────────────
function CloseIcon() {
  return (
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

// ── Sidebar Nav Item ────────────────────────────────────────────────
function NavItem({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-hover))]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ── Icons ───────────────────────────────────────────────────────────
const DashboardIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const UsersIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ProfileIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// ── Sidebar Content (shared between desktop & mobile) ───────────────
function SidebarContent({
  userType,
  location,
  navigate,
  resolvedTheme,
  toggleTheme,
  handleLogout,
  onNavClick,
}: {
  userType: string | null;
  location: ReturnType<typeof useLocation>;
  navigate: ReturnType<typeof useNavigate>;
  resolvedTheme: string;
  toggleTheme: () => void;
  handleLogout: () => void;
  onNavClick?: () => void;
}) {
  const handleNav = (path: string) => {
    navigate(path);
    onNavClick?.();
  };

  return (
    <>
      {/* Logo */}
      <div className="px-5 py-4 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <svg
              className="h-4 w-4 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">Chat App</h1>
            <p className="text-[10px] text-muted-foreground">{userType}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        <NavItem
          label="Dashboard"
          active={location.pathname === "/dashboard"}
          onClick={() => handleNav("/dashboard")}
          icon={<DashboardIcon />}
        />
        {userType === "SuperAdmin" && (
          <NavItem
            label="Manage Users"
            active={location.pathname === "/admin/users"}
            onClick={() => handleNav("/admin/users")}
            icon={<UsersIcon />}
          />
        )}
        <NavItem
          label="Profile"
          active={location.pathname === "/profile"}
          onClick={() => handleNav("/profile")}
          icon={<ProfileIcon />}
        />
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[hsl(var(--sidebar-border))] space-y-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-hover))] transition-colors"
        >
          <span className="flex items-center gap-2">
            {resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />}
            {resolvedTheme === "dark" ? "Dark Mode" : "Light Mode"}
          </span>
          <div
            className={`relative w-8 h-4 rounded-full transition-colors ${
              resolvedTheme === "dark" ? "bg-primary" : "bg-muted"
            }`}
          >
            <div
              className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform ${
                resolvedTheme === "dark" ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </div>
        </button>

        {/* Logout */}
        <button
          onClick={() => {
            handleLogout();
            onNavClick?.();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogoutIcon />
          Logout
        </button>
      </div>
    </>
  );
}

// ── Main Layout ─────────────────────────────────────────────────────
export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userType = localStorage.getItem("userType");

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const sharedProps = {
    userType,
    location,
    navigate,
    resolvedTheme,
    toggleTheme,
    handleLogout,
  };

  return (
    <div className="flex h-screen bg-background">
      {/* ── Mobile Top Bar ── (visible only on small screens) */}
      <div className="fixed top-0 left-0 right-0 z-40 flex md:hidden items-center justify-between px-4 py-3 bg-[hsl(var(--sidebar-bg))] border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <svg
              className="h-4 w-4 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h1 className="text-sm font-bold text-foreground">Chat App</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg text-foreground hover:bg-[hsl(var(--sidebar-hover))] transition-colors"
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>
      </div>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Slide-in sidebar */}
          <aside className="absolute top-0 left-0 h-full w-64 flex flex-col bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))] shadow-2xl animate-in slide-in-from-left duration-300">
            {/* Close button */}
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--sidebar-hover))] transition-colors"
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </div>

            <SidebarContent
              {...sharedProps}
              onNavClick={() => setSidebarOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* ── Desktop Sidebar ── (hidden on small screens) */}
      <aside className="w-60 hidden md:flex flex-col bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))]">
        <SidebarContent {...sharedProps} />
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-hidden pt-14 md:pt-0">
        <div className="h-full overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
