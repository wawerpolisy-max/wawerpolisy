import { redirect } from "next/navigation"

export default function AdminPage() {
  // In a real app, check admin auth status here
  redirect("/admin/login")
}
