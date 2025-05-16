"use client"
import {useRouter} from  'next/navigation';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import axios, { Axios } from "axios"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react'
import Link from "next/link"














export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const router = useRouter();
  
  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(email)
  }

  const validatePhone = (phone: string) => {
  // This regex allows for a simpler international phone number format
  const re = /^\+?[1-9]\d{1,14}$/;
  return re.test(phone.replace(/\s+/g, ''));
};

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setEmailError("")
    setPhoneError("")
    
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const data = {
      name: `${formData.get('firstName')} ${formData.get('lastName')}`,
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: 'Default Address',
      password: formData.get('password'),
    };
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        data
      );
      alert('Registration successful');
      router.push('/login');
    } catch (error: any) {
      alert(error.response?.data?.message || 'An error occurred');
    }
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    
    let isValid = true

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      isValid = false
    }

    if (!validatePhone(phone)) {
      setPhoneError("Please enter a valid phone number")
      isValid = false
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      isValid = false
    }
    
    if (!isValid) return

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    // Here you would typically handle the successful registration
    console.log("Registration successful")
    
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Enter your information to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first-name">First name</Label>
              <Input
                id="first-name"
                name="firstName"
                placeholder="John"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                name="lastName"
                placeholder="Doe"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
              disabled={isLoading}
              onChange={(e) => {
                if (validateEmail(e.target.value)) {
                  setEmailError("")
                }
              }}
              aria-invalid={emailError ? "true" : "false"}
              aria-describedby={emailError ? "email-error" : undefined}
            />
            {emailError && <p id="email-error" className="text-sm text-red-500" role="alert">{emailError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              required
              disabled={isLoading}
              onChange={(e) => {
                if (validatePhone(e.target.value)) {
                  setPhoneError("")
                }
              }}
              aria-invalid={phoneError ? "true" : "false"}
              aria-describedby={phoneError ? "phone-error" : undefined}
            />
            {phoneError && <p id="phone-error" className="text-sm text-red-500" role="alert">{phoneError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
                minLength={8}
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                disabled={isLoading}
                minLength={8}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-4 w-4" aria-hidden="true" />
                )}
                <span className="sr-only">
                  {showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                </span>
              </Button>
            </div>
          </div>
          {error && (
            <div className="text-sm text-red-500 font-medium" role="alert">
              {error}
            </div>
          )}
          <Button className="w-full transition duration-300 ease-in-out hover:bg-primary/90" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create account
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link 
            href="/login" 
            className="text-primary underline-offset-4 transition-colors hover:underline hover:text-primary/80"
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

