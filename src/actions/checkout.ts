"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/customer-session";
import { checkoutFormSchema } from "@/lib/validations";

export type CheckoutFormState = {
  error?: string;
};

const SHIPPING_COST: Record<string, number> = {
  RETIRADA: 0,
  MOTOBOY: 15,
  CORREIOS: 25,
};

export async function createOrderAction(
  _prevState: CheckoutFormState,
  formData: FormData
): Promise<CheckoutFormState> {
  let items: unknown;
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return { error: "Carrinho invalido" };
  }

  const parsed = checkoutFormSchema.safeParse({
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    shippingMethod: formData.get("shippingMethod"),
    addressStreet: formData.get("addressStreet") || undefined,
    addressNumber: formData.get("addressNumber") || undefined,
    addressComplement: formData.get("addressComplement") || undefined,
    addressNeighborhood: formData.get("addressNeighborhood") || undefined,
    addressCity: formData.get("addressCity") || undefined,
    addressState: formData.get("addressState") || undefined,
    addressZip: formData.get("addressZip") || undefined,
    notes: formData.get("notes") || undefined,
    items,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados invalidos" };
  }
  const data = parsed.data;

  // busca preco/nome oficial no banco - nunca confia no valor vindo do cliente
  const productIds = [...new Set(data.items.map((i) => i.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { variants: true },
  });
  const productById = new Map(products.map((p) => [p.id, p]));

  const orderItemsData: {
    productId: string;
    variantId: string | null;
    name: string;
    size: string | null;
    unitPrice: number;
    quantity: number;
  }[] = [];

  for (const item of data.items) {
    const product = productById.get(item.productId);
    if (!product) continue;
    const variant = item.variantId ? product.variants.find((v) => v.id === item.variantId) : null;
    orderItemsData.push({
      productId: product.id,
      variantId: variant?.id ?? null,
      name: product.name,
      size: variant?.size ?? null,
      unitPrice: Number(product.price),
      quantity: item.quantity,
    });
  }

  if (orderItemsData.length === 0) {
    return { error: "Carrinho vazio" };
  }

  const itemsTotal = orderItemsData.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const shippingCost = SHIPPING_COST[data.shippingMethod] ?? 0;
  const total = itemsTotal + shippingCost;

  const session = await getCustomerSession();

  const order = await prisma.order.create({
    data: {
      customerId: session?.customerId ?? null,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      shippingMethod: data.shippingMethod,
      addressStreet: data.addressStreet || null,
      addressNumber: data.addressNumber || null,
      addressComplement: data.addressComplement || null,
      addressNeighborhood: data.addressNeighborhood || null,
      addressCity: data.addressCity || null,
      addressState: data.addressState || null,
      addressZip: data.addressZip || null,
      shippingCost,
      itemsTotal,
      total,
      notes: data.notes || null,
      items: { create: orderItemsData },
    },
  });

  redirect(`/checkout/sucesso?pedido=${order.id}`);
}
