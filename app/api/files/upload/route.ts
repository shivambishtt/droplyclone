import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm"
import { db } from "@/lib/db/db";
import { files } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import { v4 as uuidv4 } from "uuid"

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.NEXT_IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""
})

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized request" }, { status: 401 })
        }
        const formData = await request.formData()

        const file = formData.get("file") as File
        const formUserId = formData.get("userId") as string
        const parentId = formData.get("parentId") as string || null

        if (formUserId !== userId) {
            return NextResponse.json({ message: "Unauthorized request" }, { status: 401 })
        }
        if (!file) {
            return NextResponse.json({ message: "No file provided" }, { status: 401 })
        }

        if (parentId) {
            const [parentFolder] = await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.id, parentId), //check if it exists
                        eq(files.userId, userId), // belongs to particular user
                        eq(files.isFolder, true) //should be a folder 

                    )
                )
        } if (!parentId) {
            return NextResponse.json({ message: "Parent folder not found" }, { status: 401 })
        }

        if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
            return NextResponse.json({ message: "Only images and pdf are supported" }, { status: 401 })
        }

        const buffer = await file.arrayBuffer()
        const fileBuffer = Buffer.from(buffer)

        const folderPath = parentId ? `/droply/${userId}/folder/${parentId}` : `/droply/${userId}`

        const originalFilename = file.name
        const fileExtension = originalFilename.split(".").pop()?.toLowerCase() || ""

        if (!fileExtension) {
            return NextResponse.json({ message: "File extension is required" }, { status: 400 })
        }

        if (fileExtension === "exe" || fileExtension === "js" || fileExtension === "php") {
            return NextResponse.json({ message: "File type not supported" }, { status: 400 })

        }
        const uniqueFilename = `${uuidv4()}.${fileExtension}`


        await imagekit.upload({
            file: fileBuffer,
            fileName: uniqueFilename,
            folder: folderPath,
            useUniqueFileName: false
        })
        const fileData = {

        }

        const [newFile] = await db
            .insert(files).values(fileData).returning()

        return NextResponse.json(newFile)

    } catch (error) {
        return NextResponse.json({ message: "Failed to upload file" }, { status: 400 })

    }
}
