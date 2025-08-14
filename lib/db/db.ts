import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import * as schema from "./schema"


const sql = neon(process.env.DATABASE_URL!) // sql for the raw queries directly to neon

export const db = drizzle(sql, { schema }) // query via drizzle

export { sql }