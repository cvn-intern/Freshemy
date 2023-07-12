import { z, object, string, TypeOf } from "zod";

export const createUserSchema = object({
    body: object({
        first_name: string({ required_error: "First Name is required" }),
        last_name: string({ required_error: "Last Name is required" }),
        email: string({ required_error: "Email is required" }).email("Invalid email"),
        password: string({ required_error: "Password is required" })
            .min(8, "Password must be more than 8 characters")
            .max(32, "Password must be less than 32 characters"),
        passwordConfirm: string({ required_error: "Please confirm your password" }),
    }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
