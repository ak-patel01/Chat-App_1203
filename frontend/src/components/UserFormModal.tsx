import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  createUserSchema,
  editUserSchema,
  type CreateUserFormValues,
  type EditUserFormValues,
} from "@/lib/schemas";
import { type UserDto } from "@/services/api";
import { useState } from "react";

type UserFormMode = "create" | "edit";

interface UserFormModalProps {
  mode: UserFormMode;
  user?: UserDto; // required when mode === "edit"
  onSubmit: (
    data: CreateUserFormValues | EditUserFormValues,
  ) => Promise<{ success: boolean; message?: string }>;
  onClose: () => void;
}

export default function UserFormModal({
  mode,
  user,
  onSubmit,
  onClose,
}: UserFormModalProps) {
  const isEdit = mode === "edit";
  const [serverError, setServerError] = useState<string | null>(null);

  // Use separate form types based on mode
  const form = useForm<CreateUserFormValues | EditUserFormValues>({
    resolver: zodResolver(isEdit ? editUserSchema : createUserSchema),
    defaultValues: isEdit
      ? {
          name: user?.name ?? "",
          phoneNumber: user?.phoneNumber ?? "",
          userType: (user?.userType as "User" | "SuperAdmin") ?? "User",
        }
      : {
          name: "",
          email: "",
          phoneNumber: "",
          password: "",
          userType: "User" as const,
        },
  });

  const handleFormSubmit = async (
    data: CreateUserFormValues | EditUserFormValues,
  ) => {
    setServerError(null);
    const result = await onSubmit(data);
    if (result.success) {
      onClose();
    } else {
      setServerError(
        result.message || `Failed to ${isEdit ? "update" : "create"} user`,
      );
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <CardTitle>{isEdit ? "Edit User" : "Create New User"}</CardTitle>
          <CardDescription>
            {isEdit
              ? `Editing details for ${user?.email}`
              : "Fill in the details to create a new user."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              {serverError && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 py-2 rounded text-sm">
                  {serverError}
                </div>
              )}

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email — only for create, disabled for edit */}
              {isEdit ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input value={user?.email ?? ""} disabled />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name={"email" as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="user@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password — only for create */}
              {!isEdit && (
                <FormField
                  control={form.control}
                  name={"password" as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Min 6 characters"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Role */}
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <option value="User">User</option>
                        <option value="SuperAdmin">SuperAdmin</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? isEdit
                      ? "Saving..."
                      : "Creating..."
                    : isEdit
                      ? "Save Changes"
                      : "Create User"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={form.formState.isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
