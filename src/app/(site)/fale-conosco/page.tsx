import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fale conosco - House das Marcas",
};

const WHATSAPP_URL = "https://wa.me/5512987016784";
const INSTAGRAM_URL = "https://www.instagram.com/housedasmarcas";
const STORE_ADDRESS = "Avenida das Rosas, 561, Jardim Motorama, Sao Jose dos Campos - SP";
const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(STORE_ADDRESS)}&output=embed`;
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS)}`;

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="font-display text-4xl tracking-tight">Fale conosco</h1>
      <p className="text-muted mt-3">
        Duvidas sobre tamanhos, prazos de entrega ou algum modelo que voce nao encontrou?
        Chama a gente.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] text-black font-medium px-6 py-3 text-sm hover:brightness-110 transition"
        >
          <WhatsAppIcon className="w-5 h-5" />
          Chamar no WhatsApp
        </a>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold text-black font-medium px-6 py-3 text-sm hover:brightness-110 transition"
        >
          <InstagramIcon className="w-5 h-5" />
          @housedasmarcas no Instagram
        </a>
      </div>

      <div className="mt-14 rounded-xl border border-surface-border bg-surface p-6 text-sm text-muted text-left">
        <p className="font-medium text-foreground mb-2">Loja fisica</p>
        <p>Avenida das Rosas, 561 - Jardim Motorama</p>
        <p>Sao Jose dos Campos/SP</p>
        <p className="mt-3">Entrega por motoboy na regiao e envio para todo o Brasil.</p>
      </div>

      <div className="mt-6 rounded-xl border border-surface-border bg-surface overflow-hidden">
        <iframe
          src={MAPS_EMBED_URL}
          title="Localizacao da House das Marcas no mapa"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-[280px] md:h-[360px] grayscale-[0.3] contrast-[1.1]"
        />
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-sm text-gold hover:underline py-3 border-t border-surface-border"
        >
          Ver rota no Google Maps
        </a>
      </div>
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.76.46 3.48 1.34 5L2 22l5.17-1.36a9.96 9.96 0 0 0 4.87 1.24h.01c5.52 0 10-4.48 10-10s-4.48-9.88-10.01-9.88Zm0 18.11h-.01a8.1 8.1 0 0 1-4.14-1.14l-.3-.18-3.07.81.82-2.99-.2-.31a8.12 8.12 0 0 1-1.25-4.3c0-4.49 3.66-8.14 8.16-8.14 2.18 0 4.23.85 5.77 2.39a8.1 8.1 0 0 1 2.39 5.76c0 4.49-3.66 8.1-8.17 8.1Zm4.47-6.08c-.24-.12-1.44-.71-1.67-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.42-.55-.42-.14-.01-.3-.01-.46-.01s-.42.06-.64.3c-.22.24-.85.83-.85 2.02s.87 2.35.99 2.51c.12.16 1.72 2.62 4.16 3.68.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07ZM12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56-.79.31-1.46.72-2.13 1.38A5.86 5.86 0 0 0 .63 3.14c-.3.76-.5 1.63-.56 2.91C.01 7.33 0 7.74 0 11s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.63.5 2.91.56C8.33 22.99 8.74 23 12 23s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56a5.87 5.87 0 0 0 2.13-1.38 5.86 5.86 0 0 0 1.38-2.13c.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91a5.87 5.87 0 0 0-1.38-2.13A5.86 5.86 0 0 0 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
    </svg>
  );
}
