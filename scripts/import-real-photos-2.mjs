import { PrismaClient } from "@prisma/client";
import { rename } from "node:fs/promises";
import path from "node:path";

const prisma = new PrismaClient();
const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "uploads", "products");

const CLOTHING_SIZES = ["P", "M", "G", "GG"];

const IMPORTS = [
  {
    source: "images.jpg",
    file: "calca-jogger-cinza-chumbo.jpg",
    product: {
      name: "Calca Jogger Cinza Chumbo",
      slug: "calca-jogger-cinza-chumbo",
      description: "Calca jogger em moletom, punho elastico, cordao ajustavel.",
      price: 139.9,
      categorySlug: "calcas",
      sizes: CLOTHING_SIZES,
    },
  },
  {
    source: "transferir.webp",
    file: "calca-chino-cinza.webp",
    product: {
      name: "Calca Chino Cinza",
      slug: "calca-chino-cinza",
      description: "Calca chino cinza, corte reto, tecido sarja.",
      price: 149.9,
      categorySlug: "calcas",
      sizes: CLOTHING_SIZES,
    },
  },
  {
    source: "transferir (1).webp",
    file: "calca-jogger-sarja.webp",
    product: {
      name: "Calca Jogger Sarja",
      slug: "calca-jogger-sarja",
      description: "Calca jogger em sarja, disponivel em bege, preto e camuflado.",
      price: 129.9,
      categorySlug: "calcas",
      sizes: CLOTHING_SIZES,
    },
  },
  {
    source: "images (1).jpg",
    file: "bermuda-jeans-preta.jpg",
    product: {
      name: "Bermuda Jeans Preta",
      slug: "bermuda-jeans-preta",
      description: "Bermuda jeans preta, corte reto, otima para o dia a dia.",
      price: 99.9,
      categorySlug: "bermudas",
      sizes: CLOTHING_SIZES,
    },
  },
  {
    source: "images (2).jpg",
    file: "bermuda-sarja-branca.jpg",
    product: {
      name: "Bermuda Sarja Branca",
      slug: "bermuda-sarja-branca",
      description: "Bermuda sarja branca, bolsos traseiros com botao.",
      price: 109.9,
      categorySlug: "bermudas",
      sizes: CLOTHING_SIZES,
    },
  },
  {
    source: "images (3).jpg",
    file: "bermuda-linho-verde.jpg",
    product: {
      name: "Bermuda Linho Verde Musgo",
      slug: "bermuda-linho-verde-musgo",
      description: "Bermuda em linho verde musgo, leve e confortavel.",
      price: 119.9,
      categorySlug: "bermudas",
      sizes: CLOTHING_SIZES,
    },
  },
  {
    source: "images (4).jpg",
    file: "camiseta-preta-estampada.jpg",
    product: {
      name: "Camiseta Preta Estampada",
      slug: "camiseta-preta-estampada",
      description: "Camiseta preta com estampa frontal discreta.",
      price: 79.9,
      categorySlug: "camisetas",
      sizes: CLOTHING_SIZES,
    },
  },
  {
    source: "images (5).jpg",
    file: "camiseta-preta-basica.jpg",
    product: {
      name: "Camiseta Preta Basica",
      slug: "camiseta-preta-basica",
      description: "Camiseta preta basica, algodao premium, gola redonda.",
      price: 69.9,
      categorySlug: "camisetas",
      sizes: CLOTHING_SIZES,
    },
  },
  {
    source: "transferir (2).webp",
    file: "camiseta-marrom-paris.webp",
    product: {
      name: "Camiseta Marrom Paris",
      slug: "camiseta-marrom-paris",
      description: "Camiseta marrom com estampa Paris no peito.",
      price: 74.9,
      categorySlug: "camisetas",
      sizes: CLOTHING_SIZES,
    },
  },
  {
    source: "transferir (3).webp",
    file: "camiseta-caramelo-basica.webp",
    product: {
      name: "Camiseta Caramelo Basica",
      slug: "camiseta-caramelo-basica",
      description: "Camiseta caramelo basica com pequeno logo bordado.",
      price: 74.9,
      categorySlug: "camisetas",
      sizes: CLOTHING_SIZES,
    },
  },
];

async function main() {
  for (const item of IMPORTS) {
    const from = path.join(ROOT, item.source);
    const to = path.join(OUT_DIR, item.file);
    await rename(from, to);

    const category = await prisma.category.findUnique({ where: { slug: item.product.categorySlug } });

    await prisma.product.create({
      data: {
        name: item.product.name,
        slug: item.product.slug,
        description: item.product.description,
        price: item.product.price,
        categoryId: category?.id ?? null,
        variants: { create: item.product.sizes.map((size) => ({ size, stock: 10 })) },
        images: { create: [{ url: `/uploads/products/${item.file}`, position: 0 }] },
      },
    });
    console.log(`Produto criado com foto real: ${item.product.name}`);
  }

  console.log("Importacao concluida.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
