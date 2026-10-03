import Link from "next/link";
import { RegisterForm } from "./register-form";

export default function CustomerRegisterPage() {
  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold text-center">Criar conta</h1>
      <p className="text-muted text-sm mt-2 text-center">
        Cadastre-se para agilizar suas compras.
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
      <p className="text-sm text-muted text-center mt-6">
        Ja tem conta?{" "}
        <Link href="/conta/entrar" className="text-gold hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
