import * as z from "zod"

export const signinSchema = z.object({
    identifier: z.string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email" }),
    password: z.string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be 8 characters" })
})