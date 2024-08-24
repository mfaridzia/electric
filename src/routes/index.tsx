import { useRef } from "react";
import { useShape } from "@electric-sql/react";
import { v4 as uuidv4 } from "uuid";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  created_at: number;
};

export default function Index() {
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: todos } = useShape({
    url: `http://localhost:3000/v1/shape/todos`,
  }) as unknown as { data: Todo[] };
  todos.sort((a, b) => a.created_at - b.created_at);

  return (
    <div>
      <h1>Electric Todo</h1>

      {todos.map((todo) => {
        return (
          <div key={todo.id}>
            <span>{todo.title}</span>
            <input
              type="checkbox"
              defaultChecked={todo.completed}
              onClick={async () => {
                await fetch(`http://localhost:3010/todos/${todo.id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    completed: !todo.completed,
                  }),
                });
              }}
            />

            <button
              style={{ cursor: "pointer" }}
              onClick={async () => {
                await fetch(`http://localhost:3010/todos/${todo.id}`, {
                  method: "DELETE",
                });
              }}
            >
              Delete (x)
            </button>
            <br />
            <br />
          </div>
        );
      })}

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const id = uuidv4();
          const formData = Object.fromEntries(
            new FormData(event.target as HTMLFormElement)
          );
          const res = await fetch(`http://localhost:3010/todos`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, title: formData.todo }),
          });
          console.log({ res });

          if (inputRef.current) {
            inputRef.current.value = "";
          }
        }}
      >
        <input type="text" name="todo" placeholder="New Todo" ref={inputRef} />
      </form>
    </div>
  );
}
