"use client";

import { useTransition } from "react";

export function DeleteCategoryButton({
  categoryId,
  action,
}: {
  categoryId: string;
  action: (categoryId: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm("Excluir esta categoria?")) {
          startTransition(() => action(categoryId));
        }
      }}
      className="text-red-400/80 hover:text-red-400 disabled:opacity-50 text-xs"
    >
      Excluir
    </button>
  );
}
