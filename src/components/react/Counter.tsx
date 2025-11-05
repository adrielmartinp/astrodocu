import { useState } from "react";

export const Counter = () => {
  const [count, setCount] = useState<number>(0);

  const sum = () => setCount((prev) => prev + 1);
  return (
    <button
      className="inline-flex items-center gap-2 bg-linear-to-r from-primary to-accent text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
      onClick={sum}
    >
      Contador: {count}
    </button>
  );
};
