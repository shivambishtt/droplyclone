import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { files } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm"

export async function PATCH(request: NextRequest, props: { params: Promise<{ fileId: string }> }) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized request" }, { status: 400 })
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
                    eq(files.id, fileId), //pgtable file id should be equal to the param file id
                    eq(files.userId, userId)
                )
            )
        if (!file) {
            return NextResponse.json({ message: "File not found" }, { status: 401 })
        }

        const updatedFiles = await db
            .update(files)
            .set({ isStarred: !file .isStarred })
            .where(
                and(
                    eq(files.id, fileId),
                    eq(files.userId, userId)
                )
            ).returning()
        const updatedFile = updatedFiles[0]
        return NextResponse.json(updatedFile)
    } catch (error) {
        return NextResponse.json({ message: "Failed to update file" }, { status: 500 })

    }
}