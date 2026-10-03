import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/format";
import { OrderStatusSelect } from "./order-status-select";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pedido #{order.id.slice(-8)}</h1>
          <p className="text-muted text-sm mt-1">
            {order.createdAt.toLocaleString("pt-BR")}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-surface-border bg-surface p-5">
          <h2 className="font-medium mb-3">Cliente</h2>
          <dl className="text-sm space-y-1">
            <div className="flex justify-between">
              <dt className="text-muted">Nome</dt>
              <dd>{order.customerName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">E-mail</dt>
              <dd>{order.customerEmail}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Telefone</dt>
              <dd>{order.customerPhone}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-surface-border bg-surface p-5">
          <h2 className="font-medium mb-3">Entrega</h2>
          <dl className="text-sm space-y-1">
            <div className="flex justify-between">
              <dt className="text-muted">Metodo</dt>
              <dd>{order.shippingMethod}</dd>
            </div>
            {order.addressStreet && (
              <div className="text-right text-xs text-muted leading-relaxed mt-2">
                {order.addressStreet}, {order.addressNumber}
                {order.addressComplement ? ` - ${order.addressComplement}` : ""}
                <br />
                {order.addressNeighborhood} - {order.addressCity}/{order.addressState}
                <br />
                CEP {order.addressZip}
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="rounded-xl border border-surface-border bg-surface p-5">
        <h2 className="font-medium mb-3">Itens</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted border-b border-surface-border">
              <th className="py-2">Produto</th>
              <th className="py-2">Tamanho</th>
              <th className="py-2">Qtd</th>
              <th className="py-2 text-right">Preco</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-surface-border/50">
                <td className="py-2">{item.name}</td>
                <td className="py-2">{item.size ?? "-"}</td>
                <td className="py-2">{item.quantity}</td>
                <td className="py-2 text-right">{formatBRL(item.unitPrice.toString())}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-4 text-sm gap-8">
          <div className="text-right">
            <p className="text-muted">Frete</p>
            <p className="text-muted">Total</p>
          </div>
          <div className="text-right">
            <p>{formatBRL(order.shippingCost.toString())}</p>
            <p className="font-semibold text-gold">{formatBRL(order.total.toString())}</p>
          </div>
        </div>
      </div>

      {order.notes && (
        <div className="rounded-xl border border-surface-border bg-surface p-5">
          <h2 className="font-medium mb-2">Observacoes</h2>
          <p className="text-sm text-muted">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
