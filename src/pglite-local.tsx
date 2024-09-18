import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import {
  PGliteProvider,
  usePGlite,
  useLiveQuery,
} from "@electric-sql/pglite-react";
import "./style.css";

type Item = {
  id: string;
  name: string;
};

const pg = await PGlite.create({
  dataDir: "idb://my-local-data",
  extensions: {
    live,
  },
});

await pg.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name TEXT
  );
`);

console.log("Table created, starting sync...");

function MyComponent() {
  const db = usePGlite();
  const insertItem = () => {
    db.query("INSERT INTO items (name) VALUES ($1);", [
      `Fulan-${Math.random()}`,
    ]);
  };

  const items = useLiveQuery<Item>("SELECT * FROM items ORDER BY id;", null);

  return (
    <>
      <h1 className="text-general"> PGlite x React </h1>
      <button onClick={insertItem}>Insert Item</button>
      {items?.rows.map((item) => (
        <p key={item.id} className="text-general">
          {item.name}
        </p>
      ))}
    </>
  );
}

export default function PgLite() {
  return (
    <PGliteProvider db={pg}>
      <MyComponent />
    </PGliteProvider>
  );
}
