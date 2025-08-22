import { clerkMiddleware, createRouteMatcher, auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

//createRouteMatcher basically tells that in order to access these routes no need to be authenticated
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)",])

export default clerkMiddleware(async (auth, request) => {
    const user = auth()
    const userId = (await user).userId
    const url = new URL(request.url)

    // helps the signedin user from going back to signin or signup page forcefully
    if (userId && isPublicRoute(request) && url.pathname !== "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (!isPublicRoute(request)) {
        await auth.protect()
    }

})
export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}