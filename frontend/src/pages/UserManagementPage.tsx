import { useUsers } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { type UserDto } from "@/services/api";
import { type CreateUserFormValues, type EditUserFormValues } from "@/lib/schemas";
import UserFormModal from "@/components/UserFormModal";
import { type ColumnDef } from "@tanstack/react-table";

// ── Role Badge ──────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
    const isAdmin = role === "SuperAdmin";
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${isAdmin
            ? "bg-purple-100 text-purple-700 ring-1 ring-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:ring-purple-700"
            : "bg-blue-100 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:ring-blue-700"
            }`}>
            {isAdmin ? "Admin" : "User"}
        </span>
    );
}

// ── Actions Dropdown ────────────────────────────────────────────────
function ActionsMenu({
    user,
    onEdit,
    onDelete,
    isDeleting,
}: {
    user: UserDto;
    onEdit: () => void;
    onDelete: () => void;
    isDeleting: boolean;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-accent rounded-md"
                >
                    <span className="text-muted-foreground text-base leading-none">⋯</span>
                    <span className="sr-only">Open actions</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem
                    className="text-xs cursor-pointer"
                    onClick={onEdit}
                >
                    <svg className="mr-2 h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit Details
                </DropdownMenuItem>
                {user.userType !== "SuperAdmin" && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-xs cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                            onClick={onDelete}
                            disabled={isDeleting}
                        >
                            <svg className="mr-2 h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                            {isDeleting ? "Deleting..." : "Delete User"}
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// ── Main Page ───────────────────────────────────────────────────────
export default function UserManagementPage() {
    const { users, loading, error, deleteUser, createUser, updateUser } = useUsers();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingUser, setEditingUser] = useState<UserDto | null>(null);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        setDeletingId(id);
        await deleteUser(id);
        setDeletingId(null);
    };

    const handleCreate = async (data: CreateUserFormValues | EditUserFormValues) =>
        createUser(data as CreateUserFormValues);

    const handleEdit = async (data: CreateUserFormValues | EditUserFormValues) => {
        if (!editingUser) return { success: false, message: "No user selected" };
        return updateUser(editingUser.id, data as EditUserFormValues);
    };

    const columns: ColumnDef<UserDto>[] = [
        {
            id: "index",
            header: "#",
            cell: ({ row }) => (
                <span className="text-muted-foreground text-xs">{row.index + 1}</span>
            ),
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {/* Avatar initial */}
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                        {(row.getValue("name") as string).charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-foreground">{row.getValue("name")}</span>
                </div>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <span className="text-muted-foreground">{row.getValue("email")}</span>
            ),
        },
        {
            accessorKey: "phoneNumber",
            header: "Phone",
            cell: ({ row }) => (
                <span className="text-muted-foreground">{row.getValue("phoneNumber") || "—"}</span>
            ),
        },
        {
            accessorKey: "userType",
            header: "Role",
            cell: ({ row }) => <RoleBadge role={row.getValue("userType")} />,
        },
        {
            accessorKey: "createdAt",
            header: "Created",
            cell: ({ row }) => (
                <span className="text-muted-foreground text-xs">
                    {new Date(row.getValue("createdAt")).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric"
                    })}
                </span>
            ),
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <ActionsMenu
                        user={user}
                        onEdit={() => setEditingUser(user)}
                        onDelete={() => handleDelete(user.id, user.name)}
                        isDeleting={deletingId === user.id}
                    />
                );
            },
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <p className="text-red-500 text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">User Management</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {users.length} registered user{users.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Button
                    size="sm"
                    className="h-8 gap-1.5 text-sm"
                    onClick={() => setShowCreateModal(true)}
                >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Create User
                </Button>
            </div>

            {/* Table Card */}
            <Card className="shadow-sm border-gray-200">
                <CardHeader className="px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-semibold">All Users</CardTitle>
                            <CardDescription className="text-xs mt-0.5">
                                Manage accounts, roles, and access
                            </CardDescription>
                        </div>
                        {/* Stats pills */}
                        <div className="flex gap-2 text-xs">
                            <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                                {users.filter(u => u.userType === "SuperAdmin").length} Admin
                            </span>
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                {users.filter(u => u.userType !== "SuperAdmin").length} Users
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-5 py-4">
                    <DataTable
                        columns={columns}
                        data={users}
                        searchPlaceholder="Search name, email, phone..."
                        pageSize={10}
                    />
                </CardContent>
            </Card>

            {/* Modals */}
            {showCreateModal && (
                <UserFormModal
                    mode="create"
                    onSubmit={handleCreate}
                    onClose={() => setShowCreateModal(false)}
                />
            )}
            {editingUser && (
                <UserFormModal
                    mode="edit"
                    user={editingUser}
                    onSubmit={handleEdit}
                    onClose={() => setEditingUser(null)}
                />
            )}
        </div>
    );
}
