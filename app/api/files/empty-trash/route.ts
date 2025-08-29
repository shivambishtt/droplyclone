import { auth } from "@clerk/nextjs/server";
import { files } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm"
import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { sql } from "drizzle-orm";

export async function DELETE() {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ message: "Unaauthorize request" }, { status: 400 })
        }

        await db.delete(files).where(
            and(
                eq(files.userId, userId),
                sql`"trashed_at" IS NOT NULL`
            )
        )
        return NextResponse.json({ message: "Trash cleared successfully", success: true }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Error occured while clearing the trash" }, { status: 400 })
    }

}