import { db } from "@/lib/db/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized request " }, { status: 400 })
        }
        const body = await request.json()
        const { folderName, userId: bodyUserId, parentId = null } = body

        if (bodyUserId !== userId) {
            return NextResponse.json({ error: "Unauthorized request" }, { status: 401 })
        }
        if (!folderName || typeof folderName !== "string" || folderName.trim().length < 1) {
            return NextResponse.json({ error: "Folder name is required" }, { status: 400 })
        }

        if (parentId) {
            const [parentFolder] = await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.id, parentId),
                        eq(files.userId, userId),
                        eq(files.isFolder, true)
                    )
                )
            if (!parentFolder) {
                return NextResponse.json({ error: "Parent folder not found" }, { status: 400 })
            }
        }
        const folderData = {
            id: uuidv4(),
            name: folderName.trim(),
            path: `/folders/${userId}/${uuidv4()}`,
            size: 0,
            type: "folder",
            fileURL: "",
            thumbnailURL: null,
            userId,
            parentId,
            isFolder: true,
            isStarred: false,
            isTrash: false
        }
        const [newFolder] = await db.insert(files).values(folderData).returning()
        return NextResponse.json({ success: true, message: "Folder created successfully", folder: newFolder })
    } catch (error) {

    }

}