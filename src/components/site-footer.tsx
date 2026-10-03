import Image from "next/image";

const WHATSAPP_URL = "https://wa.me/5512987016784";
const INSTAGRAM_URL = "https://www.instagram.com/housedasmarcas";

export function SiteFooter() {
  return (
    <footer className="border-t border-surface-border bg-surface mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-[auto_1fr_1fr_1fr] text-sm">
        <div className="max-w-[220px]">
          <div className="flex items-center gap-2.5">
            <Image src="/brand/logo.jpg" alt="House das Marcas" width={36} height={36} className="rounded-full" />
            <span className="font-display text-sm tracking-wide">HOUSE DAS MARCAS</span>
          </div>
          <p className="text-muted leading-relaxed mt-3">
            Avenida das Rosas, 561
            <br />
            Jardim Motorama - Sao Jose dos Campos/SP
          </p>
        </div>
        <div>
          <p className="font-medium mb-2">Entrega</p>
          <p className="text-muted leading-relaxed">
            Entrega por motoboy na regiao
            <br />
            Envios para todo o Brasil
            <br />
            Compra segura
          </p>
        </div>
        <div>
          <p className="font-medium mb-2">Loja fisica</p>
          <p className="text-muted leading-relaxed">Loja aberta - visite nosso ponto fisico</p>
        </div>
        <div>
          <p className="font-medium mb-2">Fale conosco</p>
          <div className="flex flex-col gap-1.5 text-muted">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition">
              WhatsApp
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition">
              @housedasmarcas
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-surface-border/60 py-4 text-center text-xs text-muted">
        &copy; {new Date().getFullYear()} House das Marcas. Todos os direitos reservados.
      </div>
    </footer>
  );
}
