import Link from "next/link";
import Image from "next/image";
import { getCustomerSession } from "@/lib/customer-session";
import { HeaderActions } from "@/components/header-actions";

export async function SiteHeader() {
  const session = await getCustomerSession();

  return (
    <header className="border-b border-surface-border bg-surface/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/brand/logo.jpg"
            alt="House das Marcas"
            width={44}
            height={44}
            className="rounded-full"
            priority
          />
          <span className="hidden sm:block font-display text-lg tracking-wide leading-none">
            HOUSE DAS MARCAS
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/" className="text-foreground/80 hover:text-gold transition">
            Inicio
          </Link>
          <Link href="/produtos" className="text-foreground/80 hover:text-gold transition">
            Produtos
          </Link>
          <Link href="/fale-conosco" className="text-foreground/80 hover:text-gold transition">
            Fale conosco
          </Link>
        </nav>

        <HeaderActions loggedIn={Boolean(session)} customerName={session?.name} />
      </div>
    </header>
  );
}
