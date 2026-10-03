"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/format";
import { productFormSchema } from "@/lib/validations";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");

async function saveImage(file: File): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return `/uploads/products/${filename}`;
}

export type ProductFormState = {
  error?: string;
};

function parseProductForm(formData: FormData) {
  const sizes = formData
    .getAll("sizes")
    .map((s) => String(s).trim())
    .filter(Boolean);

  return productFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    price: formData.get("price"),
    categoryId: formData.get("categoryId") || null,
    active: formData.get("active") === "on",
    sizes,
  });
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados invalidos" };
  }
  const data = parsed.data;

  const baseSlug = slugify(data.name);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const imageFiles = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);

  const imageUrls = await Promise.all(imageFiles.map(saveImage));

  await prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description ?? "",
      price: data.price,
      active: data.active,
      categoryId: data.categoryId || null,
      variants: { create: data.sizes.map((size) => ({ size, stock: 10 })) },
      images: { create: imageUrls.map((url, position) => ({ url, position })) },
    },
  });

  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function updateProductAction(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados invalidos" };
  }
  const data = parsed.data;

  const existing = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  });
  if (!existing) {
    return { error: "Produto nao encontrado" };
  }

  const imageFiles = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);
  const imageUrls = await Promise.all(imageFiles.map(saveImage));

  const existingSizes = new Set(existing.variants.map((v) => v.size));
  const newSizes = data.sizes.filter((s) => !existingSizes.has(s));
  const removedVariants = existing.variants.filter((v) => !data.sizes.includes(v.size));

  await prisma.$transaction([
    prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description ?? "",
        price: data.price,
        active: data.active,
        categoryId: data.categoryId || null,
        variants: { create: newSizes.map((size) => ({ size, stock: 10 })) },
        images: imageUrls.length
          ? { create: imageUrls.map((url, position) => ({ url, position })) }
          : undefined,
      },
    }),
    ...(removedVariants.length
      ? [
          prisma.productVariant.deleteMany({
            where: { id: { in: removedVariants.map((v) => v.id) } },
          }),
        ]
      : []),
  ]);

  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function deleteProductAction(productId: string) {
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/admin/produtos");
}

export async function deleteProductImageAction(imageId: string) {
  const image = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (!image) return;
  await prisma.productImage.delete({ where: { id: imageId } });
  try {
    await unlink(path.join(process.cwd(), "public", image.url));
  } catch {
    // arquivo ja pode nao existir, ignora
  }
  revalidatePath("/admin/produtos");
}

export async function toggleProductActiveAction(productId: string, active: boolean) {
  await prisma.product.update({ where: { id: productId }, data: { active } });
  revalidatePath("/admin/produtos");
}
