/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import {
  PGliteProvider,
  usePGlite,
  useLiveQuery,
} from "@electric-sql/pglite-react";
import "./style.css";

const pg = await PGlite.create({
  dataDir: "idb://my-local-data",
  extensions: {
    live,
  },
});

function MyComponent() {
  const db = usePGlite();
  const insertItem = () => {
    db.query("INSERT INTO test (name) VALUES ('Fulan')");
  };

  useEffect(() => {
    const func = async () => {
      await pg.exec(`
        CREATE TABLE IF NOT EXISTS test (
          id SERIAL PRIMARY KEY,
          name TEXT
        );
      `);

      console.log("Table created, starting sync...");
    };

    func();
  }, []);

  const items = useLiveQuery("SELECT * FROM test ORDER BY id;", null);

  return (
    <>
      <h1 className="text-general"> PGlite x React </h1>
      <button onClick={insertItem}>Insert Item</button>
      {items?.rows.map((item: any) => (
        <p key={item.id} className="text-general">
          - ({item.id}) {item.name}
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
