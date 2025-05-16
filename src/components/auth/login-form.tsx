"use client"
import { useRouter } from 'next/navigation';
import react,{ useState } from "react"
import { Button } from "@/components/ui/button"
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react'
import Link from "next/link"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
     
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login", // Adjust the URL as needed
        data
      );
      console.log(response.data); // Log response or handle token storage
      
      router.push('/tab-dispenser');
      // Redirect or handle successful login, e.g., store token in localStorage
      // localStorage.setItem('token', response.data.token);
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Invalid login credentials");
        alert("Invalid login credentials");
      } else {
        setError("Server error, please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link 
                href="/forgot-password" 
                className="text-sm text-primary underline-offset-4 transition-colors hover:underline hover:text-primary/80"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-4 w-4" aria-hidden="true" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
          </div>
          <Button className="w-full transition duration-300 ease-in-out hover:bg-primary/90" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link 
            href="/register" 
            className="text-primary underline-offset-4 transition-colors hover:underline hover:text-primary/80"
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}



// function setError(arg0: any) {
//   throw new Error("Function not implemented.");
// }
// function setError(arg0: string) {
//   throw new Error("Function not implemented.")
// }

