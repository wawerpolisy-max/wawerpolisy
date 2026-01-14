"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send } from "lucide-react"

interface Message {
  text: string
  sender: "user" | "bot"
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Cześć! Jestem tutaj, aby pomóc Ci z ubezpieczeniami. Jak mogę Ci pomóc?",
      sender: "bot",
    },
  ])
  const [input, setInput] = useState("")

  const quickResponses = [
    "Chcę ubezpieczenie samochodu",
    "Ubezpieczenie mieszkania",
    "Kontakt z agentem",
    "Cennik usług",
  ]

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = { text: input, sender: "user" }
    setMessages((prev) => [...prev, userMessage])

    // Simple bot response logic
    setTimeout(() => {
      let botResponse = ""
      const lowerInput = input.toLowerCase()

      if (lowerInput.includes("samochod") || lowerInput.includes("oc") || lowerInput.includes("ac")) {
        botResponse =
          "Świetnie! Oferujemy ubezpieczenia OC, AC i pakiety Assistance. Przejdź do formularza APK, aby otrzymać najlepszą ofertę."
      } else if (lowerInput.includes("mieszkan") || lowerInput.includes("dom")) {
        botResponse =
          "Ubezpieczenie mieszkania to ważna decyzja. Chronimy przed pożarem, zalaniem, kradzieżą i wieloma innymi ryzykami. Wypełnij APK, a przygotuję ofertę!"
      } else if (lowerInput.includes("kontakt") || lowerInput.includes("telefon")) {
        botResponse = "Możesz skontaktować się ze mną pod numerem: +48 500 387 340 lub email: wawerpolisy@gmail.com"
      } else if (lowerInput.includes("cena") || lowerInput.includes("koszt")) {
        botResponse =
          "Ceny są indywidualne i zależą od wielu czynników. Wypełnij formularz APK, a przygotuję dla Ciebie najlepszą ofertę z porównania 10+ towarzystw!"
      } else {
        botResponse =
          "Dziękuję za pytanie! Możesz wypełnić formularz APK lub skontaktować się bezpośrednio: +48 500 387 340"
      }

      const botMessage: Message = { text: botResponse, sender: "bot" }
      setMessages((prev) => [...prev, botMessage])
    }, 500)

    setInput("")
  }

  const handleQuickResponse = (response: string) => {
    setInput(response)
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Asystent</h3>
              <p className="text-xs text-sky-100">Online - Odpowiem w kilka sekund</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-primary-foreground/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.sender === "user" ? "bg-primary text-white" : "bg-muted text-foreground"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Quick Responses */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground text-center">Szybkie odpowiedzi:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickResponses.map((response, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickResponse(response)}
                      className="text-xs"
                    >
                      {response}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Wpisz wiadomość..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <Button onClick={handleSend} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
