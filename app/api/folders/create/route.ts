import { db } from "@/lib/db/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server";


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
            await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.id, parentId)
                    )
                )
        }

    } catch (error) {

    }

}