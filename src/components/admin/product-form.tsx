"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import type { ProductFormState } from "@/actions/products";
import { deleteProductImageAction } from "@/actions/products";

type Category = { id: string; name: string };
type ExistingImage = { id: string; url: string };

type Action = (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;

const DEFAULT_SIZES = ["P", "M", "G", "GG"];

export function ProductForm({
  action,
  categories,
  product,
  submitLabel,
}: {
  action: Action;
  categories: Category[];
  product?: {
    name: string;
    description: string;
    price: string;
    active: boolean;
    categoryId: string | null;
    sizes: string[];
    images: ExistingImage[];
  };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? DEFAULT_SIZES);
  const [images, setImages] = useState(product?.images ?? []);
  const [customSize, setCustomSize] = useState("");

  function toggleSize(size: string) {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }

  function addCustomSize() {
    const value = customSize.trim().toUpperCase();
    if (value && !sizes.includes(value)) {
      setSizes((prev) => [...prev, value]);
    }
    setCustomSize("");
  }

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm text-muted mb-1">Nome do produto</label>
        <input
          name="name"
          defaultValue={product?.name}
          required
          className="w-full rounded-lg bg-black/30 border border-surface-border px-3 py-2 outline-none focus:border-gold"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-1">Descricao</label>
        <textarea
          name="description"
          defaultValue={product?.description}
          rows={3}
          className="w-full rounded-lg bg-black/30 border border-surface-border px-3 py-2 outline-none focus:border-gold"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">Preco (R$)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.price}
            required
            className="w-full rounded-lg bg-black/30 border border-surface-border px-3 py-2 outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Categoria</label>
          <select
            name="categoryId"
            defaultValue={product?.categoryId ?? ""}
            className="w-full rounded-lg bg-black/30 border border-surface-border px-3 py-2 outline-none focus:border-gold"
          >
            <option value="">Sem categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">Tamanhos disponiveis</label>
        <div className="flex gap-2 flex-wrap">
          {DEFAULT_SIZES.concat(sizes.filter((s) => !DEFAULT_SIZES.includes(s))).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`px-3 py-1.5 rounded-lg border text-sm transition ${
                sizes.includes(size)
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-surface-border text-muted"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            value={customSize}
            onChange={(e) => setCustomSize(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomSize();
              }
            }}
            placeholder="Outro tamanho (ex: 42, Unico)"
            className="rounded-lg bg-black/30 border border-surface-border px-3 py-1.5 text-sm outline-none focus:border-gold"
          />
          <button
            type="button"
            onClick={addCustomSize}
            className="px-3 py-1.5 rounded-lg border border-surface-border text-sm text-muted hover:border-gold hover:text-gold transition"
          >
            Adicionar
          </button>
        </div>
        {sizes.map((size) => (
          <input key={size} type="hidden" name="sizes" value={size} />
        ))}
      </div>

      {images.length > 0 && (
        <div>
          <label className="block text-sm text-muted mb-2">Fotos atuais</label>
          <div className="flex gap-3 flex-wrap">
            {images.map((img) => (
              <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden border border-surface-border">
                <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
                <button
                  type="button"
                  onClick={async () => {
                    await deleteProductImageAction(img.id);
                    setImages((prev) => prev.filter((i) => i.id !== img.id));
                  }}
                  className="absolute top-0.5 right-0.5 bg-black/70 text-white text-xs rounded px-1 leading-4"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm text-muted mb-1">Adicionar fotos</label>
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          className="w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-gold file:text-black file:px-3 file:py-1.5 file:text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="active" defaultChecked={product?.active ?? true} />
        Produto visivel na loja
      </label>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-gold text-black font-medium px-5 py-2.5 text-sm hover:brightness-110 disabled:opacity-60 transition"
      >
        {pending ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}
