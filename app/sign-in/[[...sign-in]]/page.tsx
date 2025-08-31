"use client"
import SigninForm from '@/components/SigninForm'
import { useAuth } from "@clerk/nextjs"
import React from 'react'

function SignInPage() {
    const user = useAuth()

    return (
        <div>
            <SigninForm />
        </div>
    )
}

export default SignInPage
