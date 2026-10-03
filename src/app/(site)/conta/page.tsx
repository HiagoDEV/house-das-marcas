import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-session";
import { logoutCustomerAction } from "@/actions/customer-auth";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/format";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getCustomerSession();
  if (!session) redirect("/conta/entrar");

  const orders = await prisma.order.findMany({
    where: { customerId: session.customerId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Minha conta</h1>
          <p className="text-muted text-sm mt-1">
            {session.name} - {session.email}
          </p>
        </div>
        <form action={logoutCustomerAction}>
          <button
            type="submit"
            className="text-sm text-muted hover:text-red-400 transition"
          >
            Sair
          </button>
        </form>
      </div>

      <div className="mt-10">
        <h2 className="font-medium mb-4">Meus pedidos</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-muted">Voce ainda nao fez nenhum pedido.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-surface-border bg-surface p-4 flex items-center justify-between text-sm"
              >
                <div>
                  <p>Pedido #{order.id.slice(-8)}</p>
                  <p className="text-muted text-xs mt-0.5">
                    {order.createdAt.toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="text-right">
                  <p>{STATUS_LABEL[order.status] ?? order.status}</p>
                  <p className="text-gold font-medium">{formatBRL(order.total.toString())}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
