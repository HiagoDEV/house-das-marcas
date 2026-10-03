"use client";

import { useTransition } from "react";
import Link from "next/link";
import {
  deleteProductAction,
  toggleProductActiveAction,
} from "@/actions/products";

export function ProductRowActions({
  productId,
  active,
}: {
  productId: string;
  active: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-3 text-sm">
      <Link href={`/admin/produtos/${productId}`} className="text-gold hover:underline">
        Editar
      </Link>
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => toggleProductActiveAction(productId, !active))}
        className="text-foreground/70 hover:text-gold disabled:opacity-50"
      >
        {active ? "Desativar" : "Ativar"}
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (confirm("Excluir este produto? Essa acao nao pode ser desfeita.")) {
            startTransition(() => deleteProductAction(productId));
          }
        }}
        className="text-red-400/80 hover:text-red-400 disabled:opacity-50"
      >
        Excluir
      </button>
    </div>
  );
}
