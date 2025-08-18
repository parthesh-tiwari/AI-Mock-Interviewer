import { db } from "./utils/db";

/** @type { import{"drizzle-kit"}.Config } */
export default {
  schema: './utils/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_bm4JAd8vyHNF@ep-square-mouse-a47u1va0-pooler.us-east-1.aws.neon.tech/ai-interview-mocker?sslmode=require&channel_binding=require',
  }
};