import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  description: z.string().optional().default(""),
  price: z.coerce.number().positive("Preco deve ser maior que zero"),
  categoryId: z.string().optional().nullable(),
  active: z.coerce.boolean().default(true),
  sizes: z.array(z.string().min(1)).min(1, "Adicione pelo menos um tamanho"),
});

export const checkoutFormSchema = z
  .object({
    customerName: z.string().min(2, "Informe seu nome completo"),
    customerEmail: z.string().email("E-mail invalido"),
    customerPhone: z.string().min(10, "Telefone invalido"),
    shippingMethod: z.enum(["MOTOBOY", "CORREIOS", "RETIRADA"]),
    addressStreet: z.string().optional(),
    addressNumber: z.string().optional(),
    addressComplement: z.string().optional(),
    addressNeighborhood: z.string().optional(),
    addressCity: z.string().optional(),
    addressState: z.string().optional(),
    addressZip: z.string().optional(),
    notes: z.string().optional(),
    items: z
      .array(
        z.object({
          productId: z.string(),
          variantId: z.string().nullable(),
          quantity: z.number().int().positive(),
        })
      )
      .min(1, "Carrinho vazio"),
  })
  .superRefine((data, ctx) => {
    if (data.shippingMethod === "RETIRADA") return;
    const required: Array<[keyof typeof data, string]> = [
      ["addressStreet", "Informe a rua"],
      ["addressNumber", "Informe o numero"],
      ["addressNeighborhood", "Informe o bairro"],
      ["addressCity", "Informe a cidade"],
      ["addressState", "Informe o estado"],
      ["addressZip", "Informe o CEP"],
    ];
    for (const [field, message] of required) {
      if (!data[field]) {
        ctx.addIssue({ code: "custom", message, path: [field] });
      }
    }
  });

export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;
