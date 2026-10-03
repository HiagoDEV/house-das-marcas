import { getCustomerSession } from "@/lib/customer-session";
import { CheckoutForm } from "./checkout-form";

export default async function CheckoutPage() {
  const session = await getCustomerSession();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-8">Finalizar pedido</h1>
      <CheckoutForm defaultName={session?.name} defaultEmail={session?.email} />
    </div>
  );
}
