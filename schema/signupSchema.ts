import * as z from "zod"


export const signupSchema = z.object({
    email: z.string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email" }),
    password: z.string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password should be of minimum 8 characters" }),
    passwordConfirmation: z.string()
        .min(1, { message: "Please confirm your password " })
        .min(8, { message: "Password should be of minimum 8 characters" }),
})
    .refine((data) => data.password === data.passwordConfirmation, { // validating both the password fields
        message: "Password do not match",
        path: ["passwordConfirmation"] // field on which message to be shown on the client side
    })