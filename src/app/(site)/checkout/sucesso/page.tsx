import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/format";
import { ClearCartOnMount } from "./clear-cart";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ pedido?: string }>;
}) {
  const { pedido } = await searchParams;
  if (!pedido) notFound();

  const order = await prisma.order.findUnique({ where: { id: pedido }, include: { items: true } });
  if (!order) notFound();

  const whatsappMessage = encodeURIComponent(
    `Ola! Acabei de fazer o pedido #${order.id.slice(-8)} no site (total ${formatBRL(
      order.total.toString()
    )}). Gostaria de combinar o pagamento.`
  );

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <ClearCartOnMount />
      <div className="w-14 h-14 rounded-full bg-gold/15 text-gold flex items-center justify-center mx-auto text-2xl">
        ✓
      </div>
      <h1 className="text-2xl font-semibold mt-5">Pedido recebido!</h1>
      <p className="text-muted text-sm mt-2">
        Pedido #{order.id.slice(-8)} - total de {formatBRL(order.total.toString())}
      </p>
      <p className="text-muted text-sm mt-4">
        O pagamento pelo site ainda esta sendo configurado. Chama a gente no WhatsApp para
        combinar e confirmar seu pedido.
      </p>

      <a
        href={`https://wa.me/5512987016784?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-8 rounded-lg bg-[#25D366] text-black font-medium px-6 py-3 text-sm hover:brightness-110 transition"
      >
        Combinar pagamento no WhatsApp
      </a>

      <div className="mt-10">
        <Link href="/produtos" className="text-sm text-gold hover:underline">
          Continuar comprando
        </Link>
      </div>
    </div>
  );
}
