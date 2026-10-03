import { PrismaClient } from "@prisma/client";
import { rename, unlink } from "node:fs/promises";
import path from "node:path";

const prisma = new PrismaClient();
const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "uploads", "products");

const CLOTHING_SIZES = ["P", "M", "G", "GG"];
const SHOE_SIZES = ["38", "39", "40", "41", "42", "43"];
const CAP_SIZES = ["Unico"];

const IMPORTS = [
  {
    source: "01m0015-036-3.webp",
    file: "polo-cinza-mescla.webp",
    product: {
      name: "Polo Piquet Cinza Mescla",
      slug: "polo-piquet-cinza-mescla",
      description: "Polo piquet cinza mescla, gola e punhos canelados.",
      price: 94.9,
      categorySlug: "polos",
      sizes: CLOTHING_SIZES,
    },
  },
  {
    source: "01m0020-002-camisa-polo-masculina-craft-hiatto-preto-1.webp",
    file: "polo-hiatto-preto.webp",
    product: {
      name: "Polo Hiatto Preto",
      slug: "polo-hiatto-preto",
      description: "Polo Hiatto, tecido macio, caimento classico.",
      price: 99.9,
      categorySlug: "polos",
      sizes: CLOTHING_SIZES,
    },
  },
  {
    source: "03-camisa-masculina-polo-manga-curta-verde-com-bolso-piquet.webp",
    file: "polo-bolso-verde.webp",
    product: {
      name: "Polo com Bolso Verde",
      slug: "polo-com-bolso-verde",
      description: "Polo piquet verde com bolso frontal, detalhes contrastantes.",
      price: 94.9,
      categorySlug: "polos",
      sizes: CLOTHING_SIZES,
    },
  },
  {
    source: "28212001066136.webp",
    file: "polo-preta-basica.webp",
    product: {
      name: "Polo Preta Basica",
      slug: "polo-preta-basica",
      description: "Polo preta basica, algodao premium.",
      price: 89.9,
      categorySlug: "polos",
      sizes: CLOTHING_SIZES,
    },
  },
  {
    source: "images.jpg",
    file: "bone-trucker-santarem.jpg",
    product: {
      name: "Bone Trucker Santarem",
      slug: "bone-trucker-santarem",
      description: "Bone trucker, tela respiravel, ajuste traseiro.",
      price: 79.9,
      categorySlug: "bones",
      sizes: CAP_SIZES,
    },
  },
  {
    source: "images (1).jpg",
    file: "bone-trucker-mostarda.jpg",
    product: {
      name: "Bone Trucker Mostarda",
      slug: "bone-trucker-mostarda",
      description: "Bone trucker mostarda com tela preta, patch frontal.",
      price: 79.9,
      categorySlug: "bones",
      sizes: CAP_SIZES,
    },
  },
  {
    source: "images (2).jpg",
    file: "tenis-nike-azul.jpg",
    product: {
      name: "Tenis Nike Azul Marinho",
      slug: "tenis-nike-azul-marinho",
      description: "Tenis Nike esportivo, azul marinho com detalhes brancos.",
      price: 299.9,
      categorySlug: "tenis",
      sizes: SHOE_SIZES,
    },
  },
  {
    source: "images (3).jpg",
    file: "tenis-casual-preto.jpg",
    product: {
      name: "Tenis Casual Preto",
      slug: "tenis-casual-preto-foto",
      description: "Tenis casual preto, confortavel para o dia a dia.",
      price: 259.9,
      categorySlug: "tenis",
      sizes: SHOE_SIZES,
    },
  },
  {
    source: "images (4).jpg",
    file: "tenis-couro-marrom.jpg",
    product: {
      name: "Tenis Casual Couro Marrom",
      slug: "tenis-casual-couro-marrom",
      description: "Tenis casual em couro marrom, solado branco.",
      price: 249.9,
      categorySlug: "tenis",
      sizes: SHOE_SIZES,
    },
  },
  {
    source: "images (5).jpg",
    file: "tenis-slipon-bege.jpg",
    product: {
      name: "Tenis Slip-on Bege",
      slug: "tenis-slipon-bege",
      description: "Tenis slip-on bege, praticidade sem cadarco.",
      price: 199.9,
      categorySlug: "tenis",
      sizes: SHOE_SIZES,
    },
  },
  {
    source: "images (6).jpg",
    file: "tenis-couro-marrom-ziper.jpg",
    product: {
      name: "Tenis Couro Marrom com Ziper",
      slug: "tenis-couro-marrom-ziper",
      description: "Tenis casual em couro marrom com ziper lateral.",
      price: 269.9,
      categorySlug: "tenis",
      sizes: SHOE_SIZES,
    },
  },
  {
    source: "images (7).jpg",
    file: "tenis-branco-esportivo.jpg",
    product: {
      name: "Tenis Branco Esportivo",
      slug: "tenis-branco-esportivo",
      description: "Tenis branco esportivo, detalhes em vermelho e azul.",
      price: 219.9,
      categorySlug: "tenis",
      sizes: SHOE_SIZES,
    },
  },
  {
    source: "images (8).jpg",
    file: "tenis-branco-classico.jpg",
    product: {
      name: "Tenis Branco Classico",
      slug: "tenis-branco-classico",
      description: "Tenis branco classico em couro, solado azul marinho.",
      price: 229.9,
      categorySlug: "tenis",
      sizes: SHOE_SIZES,
    },
  },
];

const OLD_GENERATED_IMAGES = [
  "polo-listrada-azul.png",
  "polo-verde.png",
  "bone-nike-preto.png",
  "bone-newera-branco.png",
  "tenis-nike-branco.png",
  "tenis-casual-preto.png",
];

const OLD_PRODUCT_SLUGS = [
  "polo-listrada-azul-branca",
  "polo-ralph-classica-verde",
  "bone-nike-aba-curva-preto",
  "bone-new-era-aba-reta-branco",
  "tenis-nike-air-force-branco",
  "tenis-casual-preto",
];

async function main() {
  await prisma.product.deleteMany({ where: { slug: { in: OLD_PRODUCT_SLUGS } } });
  for (const file of OLD_GENERATED_IMAGES) {
    await unlink(path.join(OUT_DIR, file)).catch(() => {});
  }

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
