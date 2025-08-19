import * as z from "zod"

export const verificationCodeSchema = z.object({
    code: z.string()
        .min(6)
        .max(6)
})