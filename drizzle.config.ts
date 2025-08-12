import * as dotenv from "dotenv"
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: ".env.local" }) // not for the production

if (!process.env.DATABASE_URL) {
    throw new Error("Error occured while loading environment variable")
}

export default defineConfig({
    out: './drizzle', // drizzle queries folder of migration
    schema: './lib/db/schema.ts',
    dialect: 'postgresql', // db supports
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    migrations: {
        table: "__drizzle_migration",
        schema: "public"
    },
    verbose: true,
    strict: true,
});
