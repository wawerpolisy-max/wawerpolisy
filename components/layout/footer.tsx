import Link from "next/link"
import { Instagram, Mail, MapPin, Phone } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/logo-wawerpolisy.png"
                alt="wawerpolisy.pl"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <p className="text-sm text-slate-400 text-pretty">
              Lokalny agent ubezpieczeniowy w Wawrze. Kompleksowa ochrona dla Ciebie i Twojej rodziny.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/ubezpieczeniawawer/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.oferteo.pl/encantado-mateusz-pawelec/firma/5951026"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-500 transition-colors text-sm font-semibold"
              >
                Oferteo.pl
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Szybkie Linki</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-orange-500 transition-colors">
                  Strona Główna
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-orange-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-orange-500 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-orange-500 transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Insurance Types */}
          <div>
            <h3 className="text-white font-semibold mb-4">Ubezpieczenia</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ubezpieczenia/komunikacyjne" className="hover:text-orange-500 transition-colors">
                  Komunikacyjne (OC/AC)
                </Link>
              </li>
              <li>
                <Link href="/ubezpieczenia/mieszkaniowe" className="hover:text-orange-500 transition-colors">
                  Mieszkaniowe
                </Link>
              </li>
              <li>
                <Link href="/ubezpieczenia/zdrowotne" className="hover:text-orange-500 transition-colors">
                  Zdrowotne
                </Link>
              </li>
              <li>
                <Link href="/ubezpieczenia/zyciowe" className="hover:text-orange-500 transition-colors">
                  Na Życie
                </Link>
              </li>
              <li>
                <Link href="/ubezpieczenia/turystyczne" className="hover:text-orange-500 transition-colors">
                  Turystyczne
                </Link>
              </li>
              <li>
                <Link href="/ubezpieczenia/firmowe" className="hover:text-orange-500 transition-colors">
                  Firmowe
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-orange-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Telefon / WhatsApp</p>
                  <p className="text-slate-400">+48 500 387 340</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-orange-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Email</p>
                  <p className="text-slate-400">wawerpolisy@gmail.com</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-orange-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Adres</p>
                  <p className="text-slate-400">
                    Warszawa Wawer
                    <br />
                    ul. Rusinowska 7
                    <br />
                    04-944 Warszawa
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} UW - wawerpolisy.pl. Wszelkie prawa zastrzeżone.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/polityka-prywatnosci" className="hover:text-orange-500 transition-colors">
              Polityka Prywatności
            </Link>
            <Link href="/polityka-cookies" className="underline underline-offset-2">
    Polityka cookies
  </Link>
            <Link href="/regulamin" className="hover:text-orange-500 transition-colors">
              Regulamin
            </Link>
            <Link href="/rodo" className="hover:text-orange-500 transition-colors">
              RODO
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
