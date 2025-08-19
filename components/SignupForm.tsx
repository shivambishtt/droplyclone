"use client"
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { useSignUp } from '@clerk/nextjs'
import { z } from "zod"
import { signupSchema } from '@/schema/signupSchema'
import { verificationCodeSchema } from '@/schema/verificationCodeSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

function SignupForm() {
    const router = useRouter()
    const [verifying, setVerifying] = useState<boolean>(false)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    // const [verificationCode, setIsVerificationCode] = useState("")
    const [authError, setAuthError] = useState<string | null>(null)
    const [verificationError, setVerificationError] = useState<string | null>(null)
    const { signUp, isLoaded, setActive } = useSignUp()

    const { handleSubmit, register, formState: { errors } } = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirmation: ""
        }
    })

    const { handleSubmit: verificationCodehandleSubmit, register: verificationCodeRegister, formState: { errors: verificationCodeErrors } } = useForm<z.infer<typeof verificationCodeSchema>>({
        resolver: zodResolver(verificationCodeSchema),
        defaultValues: {
            code: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
        if (!isLoaded) return; // sipmply means clerk is still loading data
        setIsSubmitting(true)
        setAuthError(null)
        try {
            await signUp.create({ emailAddress: data.email, password: data.password }) //creating user in clerk
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            setVerifying(true)
        } catch (error: any) {
            console.error("Signup error:", error)
            setAuthError(error.errors?.[0]?.message || "An error occured during signup. Please try again")
        } finally {
            setIsSubmitting(false)
        }

        const handleVerificationSubmit = async (event: z.infer<typeof verificationCodeSchema>) => {
            if (!isLoaded || !signUp) return
            setIsSubmitting(true)
            setAuthError(null)

            try {
                const result = await signUp.attemptEmailAddressVerification({
                    code: event.code
                })
                console.log(result);

                if (result.status === "complete") { // correct code
                    await setActive({ session: result.createdSessionId })
                    router.push("/dashboard")
                } else {
                    console.error("Verification incomplete", result)
                    setVerificationError("An error occured while verifying the user. Please try again")
                }
            } catch (error: any) {
                setVerificationError(error.errors?.[0]?.message || "An error occured during signup. Please try again")
            } finally {
                setIsSubmitting(false)
            }
        }

        if (verifying) return <h1>This is OTP entering field  </h1>

        return (
            <h1>Signup Form with email and other fields</h1>
        )
    }
}
export default SignupForm
