import Link from "next/link";
import { LoginForm } from "./login-form";

export default function CustomerLoginPage() {
  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold text-center">Entrar</h1>
      <p className="text-muted text-sm mt-2 text-center">
        Acesse sua conta para acompanhar seus pedidos.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
      <p className="text-sm text-muted text-center mt-6">
        Ainda nao tem conta?{" "}
        <Link href="/conta/cadastro" className="text-gold hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
