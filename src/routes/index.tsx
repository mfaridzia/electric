import { useRef } from "react";
import { useShape } from "@electric-sql/react";
import { v4 as uuidv4 } from "uuid";
import "../style.css";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  created_at: number;
};

export default function Index() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: todos } = useShape({
    url: "http://localhost:3000/v1/shape/todos",
  }) as unknown as { data: Todo[] };
  todos.sort((a, b) => a.created_at - b.created_at);

  return (
    <div className="container">
      {todos.map((todo) => (
        <div key={todo.id} className="todo-item">
          <span
            className="todo-title"
            style={{
              textDecoration: todo.completed ? "line-through" : "none",
            }}
          >
            {todo.title}
          </span>
          <button
            className="done-button"
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
          >
            {todo.completed ? "Undone" : "Done"}
          </button>
          <button
            className="delete-button"
            onClick={async () => {
              await fetch(`http://localhost:3010/todos/${todo.id}`, {
                method: "DELETE",
              });
            }}
          >
            Delete (x)
          </button>
        </div>
      ))}

      <form
        className="new-todo-form"
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
        <input
          type="text"
          name="todo"
          placeholder="New Todo"
          ref={inputRef}
          className="new-todo-input"
          autoComplete="off"
        />
      </form>
    </div>
  );
}
