import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError() as Error & { statusText?: string };
  return (
    <div>
      <h1 className="text-general">Oops!</h1>
      <p className="text-general">Sorry, an unexpected error has occurred.</p>
      <p className="text-general">
        <i className="text-general">{error.statusText ?? error.message}</i>
      </p>
    </div>
  );
}
