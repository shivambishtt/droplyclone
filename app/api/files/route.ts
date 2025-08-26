import { auth } from "@clerk/nextjs/server";
import { files } from "@/lib/db/schema";
import { db } from "@/lib/db/db";
import { eq, and, isNull } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized request" }, { status: 401 })
        }
        const searchparams = request.nextUrl.searchParams
        const queryUserId = searchparams.get("userId")
        const parentId = searchparams.get("parentId")

        if (!queryUserId || queryUserId !== userId) {
            return NextResponse.json({ message: "Unauthorized request" }, { status: 401 })
        }
        let userFiles;

        if (parentId) {
            userFiles = await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.userId, userId),
                        eq(files.parentId, parentId)
                    )
                )
        } else {
            await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.userId, userId),
                        isNull(files.parentId)
                    )
                )
        }
        return NextResponse.json(userFiles)
    } catch (error) {
        return NextResponse.json({ message: "Error fetching files" }, { status: 500 })

    }

}