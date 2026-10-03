"use client";

import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import { useCartStore, cartCount } from "@/lib/cart-store";

export function HeaderActions({
  loggedIn,
  customerName,
}: {
  loggedIn: boolean;
  customerName?: string;
}) {
  const items = useCartStore((s) => s.items);
  const count = cartCount(items);

  return (
    <div className="flex items-center gap-4">
      <Link
        href={loggedIn ? "/conta" : "/conta/entrar"}
        className="flex items-center gap-1.5 text-sm text-foreground/80 hover:text-gold transition"
      >
        <User className="w-[18px] h-[18px]" strokeWidth={1.75} />
        <span className="hidden sm:inline">{loggedIn ? customerName?.split(" ")[0] : "Entrar"}</span>
      </Link>
      <Link href="/carrinho" className="relative flex items-center text-foreground/80 hover:text-gold transition">
        <ShoppingBag className="w-[20px] h-[20px]" strokeWidth={1.75} />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-gold text-black text-[10px] font-semibold px-1">
            {count}
          </span>
        )}
      </Link>
    </div>
  );
}
