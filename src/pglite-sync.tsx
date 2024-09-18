import { PGlite } from "@electric-sql/pglite";
import { electricSync } from "@electric-sql/pglite-sync";
import { live } from "@electric-sql/pglite/live";
import { PGliteProvider, useLiveQuery } from "@electric-sql/pglite-react";
import "./style.css";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  created_at: Date;
};

const pg = await PGlite.create({
  dataDir: "idb://my-pgdata",
  extensions: {
    live,
    electric: electricSync({ debug: true }),
  },
});

await pg.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
  )
`);

await pg.electric.syncShapeToTable({
  url: "http://localhost:3000/v1/shape/todos",
  table: "todos",
  primaryKey: ["id"],
});

function Component() {
  const items = useLiveQuery<Todo>(
    "SELECT id, title, completed, created_at FROM todos;",
    null
  );

  // pg.live.query("SELECT * FROM todos", null, (res) => {
  //   console.log(`Rendering update`);
  //   console.log(res);
  // });

  return (
    <>
      <h1 className="text-general">PGlite x React (Sync to Electric Server)</h1>
      {items?.rows.length === 0 ? (
        <p className="text-general">no data</p>
      ) : (
        items?.rows.map((item, index) => (
          <p className="text-general" key={index}>
            - {item.id} - {item.title} ({item.completed ? "Done" : "WIP"})
          </p>
        ))
      )}
    </>
  );
}

export default function PgLite2() {
  return (
    <PGliteProvider db={pg}>
      <Component />
    </PGliteProvider>
  );
}
