"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Mail } from "lucide-react" // Added Gmail icon

export function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In real app, validate credentials here
    // For demo, any login succeeds
    router.push("/portal/dashboard")
  }

  const handleGmailLogin = async () => {
    setLoading(true)
    setError("")

    // In production, implement OAuth flow with Google
    // For now, simulate Gmail login
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push("/portal/dashboard")
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{error}</div>}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="twoj@email.pl" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Hasło</Label>
            <Link href="/portal/reset-hasla" className="text-sm text-blue-600 hover:underline">
              Zapomniałeś hasła?
            </Link>
          </div>
          <Input id="password" name="password" type="password" required placeholder="••••••••" />
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
          {loading ? "Logowanie..." : "Zaloguj się"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">lub</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full bg-transparent"
        onClick={handleGmailLogin}
        disabled={loading}
      >
        <Mail className="h-4 w-4 mr-2" />
        Zaloguj się przez Gmail
      </Button>
    </div>
  )
}
