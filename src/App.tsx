import { useShape } from "@electric-sql/react";

function App() {
  const { data } = useShape({
    url: `http://localhost:3000/v1/shape/todos`,
  });

  return <pre>{JSON.stringify(data, null, 4)}</pre>;
}

export default App;
