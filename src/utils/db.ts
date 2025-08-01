/* eslint-disable @typescript-eslint/no-explicit-any */
import { PGlite } from "@electric-sql/pglite";
import { vector } from "@electric-sql/pglite/vector";

let dbInstance: PGlite | null = null;

export async function getDB(): Promise<PGlite> {
  if (dbInstance) return dbInstance;

  const db = new PGlite("idb://local-embedding-db", {
    extensions: { vector },
  });

  await db.waitReady;
  dbInstance = db;
  return db;
}

export async function initSchema() {
  const db = await getDB();

  await db.query(`
    CREATE TABLE IF NOT EXISTS embeddings (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      embedding vector(384) NOT NULL
    );
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_embeddings_embedding ON embeddings USING ivfflat (embedding vector_l2_ops);
  `);
}

export async function insertEmbedding(
  db: PGlite,
  content: string,
  embedding: number[]
) {
  await db.query(`INSERT INTO embeddings (text, embedding) VALUES ($1, $2);`, [
    content,
    `[${embedding.join(',')}]`  ,
  ]);
}

export async function doVectorSearch(
  db: PGlite,
  embedding: number[],
  match_threshold = 0.8,
  limit = 3
) {
  const res = await db.query(
    `
    SELECT text, embedding, (embedding <#> $1) AS distance
    FROM embeddings
    ORDER BY embedding <#> $1
    LIMIT $2;
    `,
    [`[${embedding.join(',')}]`, Number(limit)]
  );

  return res.rows.filter((row: any) => row.distance < match_threshold);
}

export async function clearEmbeddingDB() {
  const db = await getDB();
  await db.query(`DROP TABLE IF EXISTS embeddings;`);
  await initSchema();
}
