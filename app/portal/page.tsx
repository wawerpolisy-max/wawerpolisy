import { redirect } from "next/navigation"

export default function PortalPage() {
  // In a real app, check auth status here
  // For now, redirect to login
  redirect("/portal/login")
}
