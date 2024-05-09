import { FallbackProps } from "@/types/error-boundary";
import { FC } from "react";

const ErrorFallback: FC<FallbackProps> = ({ error }) => {

  return (<main className="grid-center min-h-dvh w-full">
    <div role="alert">
      <p>Something went wrong:</p>
      <pre className="font-mono text-red-500">{error.message}</pre>
    </div>
  </main>);
}


export default ErrorFallback;