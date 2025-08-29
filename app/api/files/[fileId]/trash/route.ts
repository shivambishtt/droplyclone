import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { files } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm"

export async function PATCH(request: NextRequest, props: { params: Promise<{ fileId: string }> }) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized request" }, { status: 401 })
        }
        const { fileId } = await props.params
        if (!fileId) {
            return NextResponse.json({ message: "File id is required" }, { status: 400 })
        }

        const [file] = await db
            .select()
            .from(files)
            .where(
                and(
                    eq(files.id, fileId),
                    eq(files.userId, userId)
                )
            )

        if (!file) {
            return NextResponse.json({ message: "File not found" }, { status: 400 })
        }

        const trashedFiles = await db
            .update(files)
            .set({
                isTrash: !file.isTrash,
                trashedAt: new Date()
            })
            .where(and(
                eq(files.id, fileId),
                eq(files.userId, userId)
            )).returning()
        const trashedFile = trashedFiles[0]

        return NextResponse.json(trashedFile)
    } catch (error) {
        return NextResponse.json({ message: "Failed to move file to trash" }, { status: 400 })

    }
}