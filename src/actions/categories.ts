"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/format";

export async function createCategoryAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const count = await prisma.category.count();
  await prisma.category.create({ data: { name, slug, position: count } });
  revalidatePath("/admin/produtos");
  revalidatePath("/admin/categorias");
}

export async function deleteCategoryAction(categoryId: string) {
  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin/produtos");
  revalidatePath("/admin/categorias");
}
