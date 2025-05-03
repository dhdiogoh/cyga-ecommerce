import { LoginForm } from "@/components/login-form"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Admin E-commerce</h1>
          <p className="text-muted-foreground">Faça login para acessar o painel</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
