// app/actions.ts
"use server";
import { neon } from "@neondatabase/serverless";

export async function getData() {
    const sql = neon(process.env.DATABASE_URL='postgresql://neondb_owner:npg_6SXp3hCUTGPc@ep-fancy-moon-ad802hep-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
    const data = await sql`...`;
    return data;
}