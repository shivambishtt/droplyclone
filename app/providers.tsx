"use client"
import type { ThemeProviderProps } from "next-themes"
import { ImageKitProvider } from "imagekitio-next"

export interface ChildrenProviderProps {
    children: React.ReactNode,
    themeProps?: ThemeProviderProps
}

const authenticator = async () => {
    try {
        const response = await fetch("/api/imagekit-auth");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Authentication error:", error);
        throw error;
    }
};

export function Providers({ children, themeProps }: ChildrenProviderProps) {
    return (
        <ImageKitProvider
            authenticator={authenticator}
            publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""}
            urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""}>
            <h1>{children}</h1>
        </ImageKitProvider>
    )
}