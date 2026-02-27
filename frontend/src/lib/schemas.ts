import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export type RegisterFormValues = z.infer<typeof registerSchema>

// Schema for Create User (password required)
export const createUserSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    userType: z.enum(["User", "SuperAdmin"], { message: "Select a valid role" }),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>

// Schema for Edit User (no password, no email change)
export const editUserSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
    userType: z.enum(["User", "SuperAdmin"], { message: "Select a valid role" }),
})

export type EditUserFormValues = z.infer<typeof editUserSchema>
