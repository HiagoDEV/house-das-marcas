"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";

type Variant = { id: string; size: string; stock: number };

export function AddToCart({
  productId,
  name,
  price,
  image,
  variants,
}: {
  productId: string;
  name: string;
  price: number;
  image: string | null;
  variants: Variant[];
}) {
  const [selected, setSelected] = useState<string | null>(variants[0]?.id ?? null);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  const selectedVariant = variants.find((v) => v.id === selected) ?? null;
  const outOfStock = variants.length > 0 && selectedVariant?.stock === 0;

  function handleAdd() {
    addItem({
      productId,
      variantId: selectedVariant?.id ?? null,
      name,
      size: selectedVariant?.size ?? null,
      price,
      image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div>
      {variants.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-muted mb-2">Tamanho</p>
          <div className="flex gap-2 flex-wrap">
            {variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                disabled={variant.stock === 0}
                onClick={() => setSelected(variant.id)}
                className={`px-3 py-1.5 rounded-lg border text-sm transition ${
                  selected === variant.id
                    ? "border-gold bg-gold/10 text-gold"
                    : variant.stock === 0
                    ? "border-surface-border/40 text-muted/50 line-through cursor-not-allowed"
                    : "border-surface-border text-foreground/90 hover:border-gold"
                }`}
              >
                {variant.size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          disabled={outOfStock}
          onClick={handleAdd}
          className="flex-1 rounded-lg bg-gold text-black font-medium px-6 py-3 text-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {outOfStock ? "Esgotado" : added ? "Adicionado!" : "Adicionar ao carrinho"}
        </button>
        <button
          type="button"
          disabled={outOfStock}
          onClick={() => {
            handleAdd();
            router.push("/carrinho");
          }}
          className="flex-1 rounded-lg border border-gold text-gold font-medium px-6 py-3 text-sm hover:bg-gold/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Comprar agora
        </button>
      </div>
    </div>
  );
}
