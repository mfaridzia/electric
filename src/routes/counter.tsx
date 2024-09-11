import { useShape } from "@electric-sql/react";
import { v4 as uuidv4 } from "uuid";
import "../style.css";

export default function Counter() {
  const { data: counter } = useShape({
    url: `http://localhost:3000/v1/shape/counter`,
  }) as unknown as { data: { id: string }[] };

  return (
    <div className="container">
      {counter.map((item) => (
        <span key={item.id}> 👍 </span>
      ))}

      <button
        onClick={async () => {
          await fetch(`http://localhost:3010/counter`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: uuidv4(),
            }),
          });
        }}
      >
        Give realtime reaction
      </button>
    </div>
  );
}
