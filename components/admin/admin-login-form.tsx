"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AdminLoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In real app, validate admin credentials here
    router.push("/admin/dashboard")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{error}</div>}

      <div className="space-y-2">
        <Label htmlFor="email">Email Administratora</Label>
        <Input id="email" name="email" type="email" required placeholder="admin@wawerpolisy.pl" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Hasło</Label>
        <Input id="password" name="password" type="password" required placeholder="••••••••" />
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
        {loading ? "Logowanie..." : "Zaloguj się"}
      </Button>
    </form>
  )
}
