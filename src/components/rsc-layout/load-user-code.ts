import { getDb } from "@/data/db";
import { users as usersTable } from "@/drizzle/schema";

async function temp() {
  const db = await getDb();
  const [user] = await db.select().from(usersTable).limit(1);
}
