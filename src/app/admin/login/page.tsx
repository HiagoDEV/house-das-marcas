import Image from "next/image";
import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image
            src="/brand/logo.jpg"
            alt="House das Marcas"
            width={56}
            height={56}
            className="rounded-full mx-auto"
          />
          <h1 className="font-display text-2xl tracking-tight mt-4">Painel do lojista</h1>
          <p className="text-muted text-sm mt-1">Entre com suas credenciais de administrador</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
