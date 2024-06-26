import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from ".";

migrate(db, { migrationsFolder: "drizzle" }).then(() => {
  console.log("Migrations done");
});
