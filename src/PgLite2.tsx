/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { PGlite } from "@electric-sql/pglite";
import { electricSync } from "@electric-sql/pglite-sync";
import { live } from "@electric-sql/pglite/live";
import { PGliteProvider, useLiveQuery } from "@electric-sql/pglite-react";

const pg = await PGlite.create({
  dataDir: "idb://my-pgdata",
  extensions: {
    live,
    electric: electricSync({ debug: true }),
  },
});

function MyComponent() {
  useEffect(() => {
    const func = async () => {
      await pg.exec(`
        CREATE TABLE IF NOT EXISTS todos (
          id UUID PRIMARY KEY,
          title TEXT NOT NULL,
          completed BOOLEAN NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL
        )
      `);

      await pg.electric.syncShapeToTable({
        url: "http://localhost:3000/v1/shape/todos?offset=-1",
        //schema: "todos",
        table: "todos",
        primaryKey: ["id"],
      });

      console.log("Table created, starting sync...");
    };

    func();
  }, []);

  const items = useLiveQuery("SELECT * FROM todos;", null);

  pg.live.query("SELECT * FROM todos", null, (res) => {
    console.log(`Rendering update`);
    console.log(res);
  });

  return (
    <>
      <h1> PGLite x React (Sync to Electric Server) </h1>
      {items?.rows.map((item: any) => (
        <p key={item.id}>
          - ({item.id}) {item.title}
        </p>
      ))}
    </>
  );
}

export default function PgLite2() {
  return (
    <PGliteProvider db={pg}>
      <MyComponent />
    </PGliteProvider>
  );
}
