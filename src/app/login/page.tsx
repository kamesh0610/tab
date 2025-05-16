import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">Welcome Back</h1>
      <LoginForm />
    </div>
  )
}

