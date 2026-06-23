import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { query } from "./pool.js";

const root = path.dirname(fileURLToPath(import.meta.url));

export async function migrate() {
  const sql = readFileSync(path.join(root, "schema.sql"), "utf8");
  await query(sql);
}
