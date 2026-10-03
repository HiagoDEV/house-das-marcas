import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.adminUser.upsert({
    where: { email: "admin@housedasmarcas.com.br" },
    update: {},
    create: {
      email: "admin@housedasmarcas.com.br",
      passwordHash,
      name: "House das Marcas",
    },
  });

  const categorias = [
    { name: "Futebol Nacional", slug: "futebol-nacional" },
    { name: "Futebol Internacional", slug: "futebol-internacional" },
    { name: "Selecoes", slug: "selecoes" },
    { name: "Retro", slug: "retro" },
  ];

  for (const [index, cat] of categorias.entries()) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, position: index },
    });
  }

  const futebolNacional = await prisma.category.findUniqueOrThrow({
    where: { slug: "futebol-nacional" },
  });
  const selecoes = await prisma.category.findUniqueOrThrow({
    where: { slug: "selecoes" },
  });

  const produtos = [
    {
      name: "Camisa Corinthians I 25/26",
      slug: "camisa-corinthians-i-25-26",
      description:
        "Camisa titular do Corinthians, tecido leve e respiravel, pronta entrega.",
      price: 149.9,
      categoryId: futebolNacional.id,
    },
    {
      name: "Camisa Palmeiras I 25/26",
      slug: "camisa-palmeiras-i-25-26",
      description: "Camisa titular do Palmeiras, modelo torcedor.",
      price: 149.9,
      categoryId: futebolNacional.id,
    },
    {
      name: "Camisa Selecao Brasileira I",
      slug: "camisa-selecao-brasileira-i",
      description: "Camisa titular da Selecao Brasileira, modelo torcedor.",
      price: 169.9,
      categoryId: selecoes.id,
    },
  ];

  const sizes = ["P", "M", "G", "GG"];

  for (const produto of produtos) {
    const created = await prisma.product.upsert({
      where: { slug: produto.slug },
      update: {},
      create: {
        ...produto,
        variants: {
          create: sizes.map((size) => ({ size, stock: 10 })),
        },
      },
    });
    console.log(`Produto pronto: ${created.name}`);
  }

  console.log("Seed concluido. Login admin: admin@housedasmarcas.com.br / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
