"use client"
import React from 'react'
import { useForm } from "react-hook-form"
import { useSignUp } from '@clerk/nextjs'
import { z } from "zod"
import { signupSchema } from '@/schema/signupSchema'


function SignupForm() {
    const { signUp, isLoaded, setActive } = useSignUp()
    const onSubmit = async () => { }
    const handleVerificationSubmit = async () => { }

    return (
        <div>

        </div>
    )
}

export default SignupForm
