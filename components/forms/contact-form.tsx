"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Ogólne pytanie");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    if (!consent) {
      setStatus("error");
      setErrorMsg("Zaznacz zgodę na przetwarzanie danych (RODO).");
      return;
    }

    try {
      const res = await fetch("/api/contact-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ← JEDYNY header!
        },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          topic,
          message,
          consent,
          website: "", // honeypot, backend go obsłuży
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Nie udało się wysłać wiadomości.");
        return;
      }

      // OK
      setStatus("success");
      setFullName("");
      setPhone("");
      setEmail("");
      setTopic("Ogólne pytanie");
      setMessage("");
      setConsent(false);
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "Wystąpił błąd serwera.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-sm font-medium">Imię i nazwisko *</label>
          <input
            className="input"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jan Kowalski"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Telefon</label>
            <input
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+48..."
            />
          </div>
          <div>
            <label className="text-sm font-medium">E-mail</label>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@domena.pl"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Temat</label>
          <select
            className="input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option>Ogólne pytanie</option>
            <option>Wycena</option>
            <option>Przedłużenie polisy</option>
            <option>Szerszy temat</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Wiadomość *</label>
          <textarea
            className="input min-h-[120px]"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Treść wiadomości..."
          />
        </div>

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={consent}
            onChange={() => setConsent(!consent)}
          />
          <span className="text-sm text-muted-foreground leading-snug">
            Wyrażam zgodę na przetwarzanie danych w celu kontaktu. Szczegóły w{" "}
            <a href="/RODO" className="underline" target="_blank">
              RODO
            </a>{" "}
            i{" "}
            <a href="/polityka-prywatnosci" className="underline" target="_blank">
              polityce prywatności
            </a>
            .
          </span>
        </div>

        {status === "error" && (
          <p className="text-sm text-red-600">{errorMsg}</p>
        )}

        {status === "success" && (
          <p className="text-sm text-green-600">
            Wiadomość została wysłana — oddzwonię/odpiszę wkrótce.
          </p>
        )}

        <Button type="submit" className="w-full" disabled={status === "loading"}>
          {status === "loading" ? "Wysyłanie..." : "Wyślij wiadomość"}
        </Button>
      </div>
    </form>
  );
}
