"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createCustomerSession, destroyCustomerSession } from "@/lib/customer-session";

export type AuthFormState = {
  error?: string;
};

export async function registerCustomerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || password.length < 6) {
    return { error: "Preencha nome, e-mail e uma senha com pelo menos 6 caracteres" };
  }

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ja existe uma conta com esse e-mail" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const customer = await prisma.customer.create({
    data: { name, email, phone: phone || null, passwordHash },
  });

  await createCustomerSession({ customerId: customer.id, email: customer.email, name: customer.name });
  redirect("/conta");
}

export async function loginCustomerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Preencha e-mail e senha" };
  }

  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer) {
    return { error: "E-mail ou senha incorretos" };
  }

  const valid = await bcrypt.compare(password, customer.passwordHash);
  if (!valid) {
    return { error: "E-mail ou senha incorretos" };
  }

  await createCustomerSession({ customerId: customer.id, email: customer.email, name: customer.name });
  redirect("/conta");
}

export async function logoutCustomerAction() {
  await destroyCustomerSession();
  redirect("/");
}
