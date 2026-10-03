"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore, cartTotal } from "@/lib/cart-store";
import { formatBRL } from "@/lib/format";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = cartTotal(items);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Seu carrinho esta vazio</h1>
        <p className="text-muted text-sm mt-2">Adicione produtos para continuar.</p>
        <Link
          href="/produtos"
          className="inline-block mt-6 rounded-lg bg-gold text-black font-medium px-6 py-3 text-sm hover:brightness-110 transition"
        >
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-8">Seu carrinho</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId ?? "none"}`}
            className="flex items-center gap-4 rounded-xl border border-surface-border bg-surface p-4"
          >
            <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-black/30 shrink-0">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">{item.name}</p>
              {item.size && <p className="text-xs text-muted mt-0.5">Tamanho: {item.size}</p>}
              <p className="text-gold font-medium mt-1">{formatBRL(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                className="w-7 h-7 rounded-lg border border-surface-border text-sm hover:border-gold hover:text-gold transition"
              >
                -
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                className="w-7 h-7 rounded-lg border border-surface-border text-sm hover:border-gold hover:text-gold transition"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.productId, item.variantId)}
              className="text-red-400/80 hover:text-red-400 text-sm ml-2"
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-surface-border pt-6">
        <div>
          <p className="text-sm text-muted">Subtotal</p>
          <p className="text-xl font-semibold text-gold">{formatBRL(total)}</p>
        </div>
        <Link
          href="/checkout"
          className="rounded-lg bg-gold text-black font-medium px-6 py-3 text-sm hover:brightness-110 transition"
        >
          Finalizar compra
        </Link>
      </div>
    </div>
  );
}
