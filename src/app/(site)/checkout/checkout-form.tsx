"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, cartTotal } from "@/lib/cart-store";
import { createOrderAction, type CheckoutFormState } from "@/actions/checkout";
import { formatBRL, formatCep, formatPhone } from "@/lib/format";

const initialState: CheckoutFormState = {};

const SHIPPING_LABEL: Record<string, string> = {
  RETIRADA: "Retirar na loja (gratis)",
  MOTOBOY: "Motoboy - Sao Jose dos Campos (R$ 15,00)",
  CORREIOS: "Correios - todo o Brasil (R$ 25,00)",
};

export function CheckoutForm({
  defaultName,
  defaultEmail,
}: {
  defaultName?: string;
  defaultEmail?: string;
}) {
  const items = useCartStore((s) => s.items);
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createOrderAction, initialState);
  const [shippingMethod, setShippingMethod] = useState("MOTOBOY");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/carrinho");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = cartTotal(items) + (shippingMethod === "MOTOBOY" ? 15 : shippingMethod === "CORREIOS" ? 25 : 0);

  if (items.length === 0) return null;

  return (
    <form action={formAction} className="grid md:grid-cols-[1fr_320px] gap-10">
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(
          items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity }))
        )}
      />

      <div className="space-y-6">
        <section>
          <h2 className="font-medium mb-3">Seus dados</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm text-muted mb-1">Nome completo</label>
              <input
                name="customerName"
                defaultValue={defaultName}
                required
                className="w-full rounded-lg bg-black/30 border border-surface-border px-3 py-2 outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">E-mail</label>
              <input
                name="customerEmail"
                type="email"
                defaultValue={defaultEmail}
                required
                className="w-full rounded-lg bg-black/30 border border-surface-border px-3 py-2 outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Telefone / WhatsApp</label>
              <input
                name="customerPhone"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                required
                placeholder="(12) 90000-0000"
                className="w-full rounded-lg bg-black/30 border border-surface-border px-3 py-2 outline-none focus:border-gold"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-medium mb-3">Entrega</h2>
          <div className="space-y-2">
            {Object.entries(SHIPPING_LABEL).map(([value, label]) => (
              <label
                key={value}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm cursor-pointer transition ${
                  shippingMethod === value ? "border-gold bg-gold/10" : "border-surface-border"
                }`}
              >
                <input
                  type="radio"
                  name="shippingMethod"
                  value={value}
                  checked={shippingMethod === value}
                  onChange={() => setShippingMethod(value)}
                  className="accent-[var(--gold)]"
                />
                {label}
              </label>
            ))}
          </div>

          {shippingMethod !== "RETIRADA" && (
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm text-muted mb-1">CEP</label>
                <input
                  name="addressZip"
                  value={cep}
                  onChange={(e) => setCep(formatCep(e.target.value))}
                  required
                  className="w-full rounded-lg bg-black/30 border border-surface-border px-3 py-2 outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Cidade</label>
                <input
                  name="addressCity"
                  required
                  className="w-full rounded-lg bg-black/30 border border-surface-border px-3 py-2 outline-none focus:border-gold"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-muted mb-1">Rua</label>
                <input
                  name="addressStreet"
                  required
                  className="w-full rounded-lg bg-black/30 border border-surface-border px-3 py-2 outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Numero</label>
                <input
                  name="addressNumber"
                  required
                  className="w-full rounded-lg bg-black/30 border border-surface-border px-3 py-2 outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Complemento</label>
                <input
                  name="addressComplement"
                  className="w-full rounded-lg bg-black/30 border border-surface-border px-3 py-2 outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Bairro</label>
                <input
                  name="addressNeighborhood"
                  required
                  className="w-full rounded-lg bg-black/30 border border-surface-border px-3 py-2 outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Estado</label>
                <input
                  name="addressState"
                  maxLength={2}
                  placeholder="SP"
                  required
                  className="w-full rounded-lg bg-black/30 border border-surface-border px-3 py-2 outline-none focus:border-gold"
                />
              </div>
            </div>
          )}
        </section>

        <section>
          <label className="block text-sm text-muted mb-1">Observacoes (opcional)</label>
          <textarea
            name="notes"
            rows={2}
            className="w-full rounded-lg bg-black/30 border border-surface-border px-3 py-2 outline-none focus:border-gold"
          />
        </section>

        {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      </div>

      <aside className="h-fit rounded-xl border border-surface-border bg-surface p-5 space-y-4">
        <h2 className="font-medium">Resumo</h2>
        <div className="space-y-2 text-sm">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId ?? "none"}`} className="flex justify-between gap-2">
              <span className="text-muted">
                {item.quantity}x {item.name}
                {item.size ? ` (${item.size})` : ""}
              </span>
              <span>{formatBRL(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-surface-border pt-3 flex justify-between font-semibold">
          <span>Total estimado</span>
          <span className="text-gold">{formatBRL(total)}</span>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-gold text-black font-medium py-3 text-sm hover:brightness-110 disabled:opacity-60 transition"
        >
          {pending ? "Enviando pedido..." : "Confirmar pedido"}
        </button>
        <p className="text-xs text-muted">
          O pagamento ainda nao e feito pelo site. Depois de confirmar, combinamos a forma de
          pagamento pelo WhatsApp.
        </p>
      </aside>
    </form>
  );
}
