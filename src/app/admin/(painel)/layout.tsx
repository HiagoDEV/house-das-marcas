import Link from "next/link";
import { getAdminSession } from "@/lib/session";
import { logoutAction } from "@/actions/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/pedidos", label: "Pedidos" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="w-60 shrink-0 border-r border-surface-border bg-surface flex flex-col">
        <div className="px-5 py-6">
          <p className="text-gold text-xs tracking-[0.3em] uppercase">House das Marcas</p>
          <p className="text-sm text-muted mt-1">Painel do lojista</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-black/30 hover:text-gold transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-surface-border">
          <p className="px-3 text-xs text-muted truncate">{session?.email}</p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full text-left rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-black/30 hover:text-red-400 transition"
            >
              Sair
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">{children}</main>
    </div>
  );
}
