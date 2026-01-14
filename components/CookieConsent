'use client';

import React, { useEffect, useMemo, useState } from 'react';

type ConsentState = {
  necessary: true;          // zawsze true
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;        // ISO
  version: number;          // zwiększ, gdy zmienisz logikę/teksty
};

const CONSENT_KEY = 'wp_cookie_consent';
const CONSENT_VERSION = 1;

const defaultConsent = (): ConsentState => ({
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
  timestamp: new Date().toISOString(),
  version: CONSENT_VERSION,
});

function safeParseConsent(raw: string | null): ConsentState | null {
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== 'object') return null;
    if (obj.version !== CONSENT_VERSION) return null;
    if (obj.necessary !== true) return null;
    return obj as ConsentState;
  } catch {
    return null;
  }
}

function saveConsent(consent: ConsentState) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
}

export function getConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  return safeParseConsent(localStorage.getItem(CONSENT_KEY));
}

/**
 * Użyj tego helpera w miejscach, gdzie ładujesz trackery.
 * Przykład: if (hasConsent('analytics')) { ... }
 */
export function hasConsent(category: keyof Omit<ConsentState, 'timestamp' | 'version'>) {
  const c = getConsent();
  if (!c) return false;
  return Boolean(c[category]);
}

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [consent, setConsent] = useState<ConsentState | null>(null);

  // Na start: czy już jest zgoda?
  useEffect(() => {
    setConsent(getConsent());
  }, []);

  const shouldShowBanner = useMemo(() => consent === null, [consent]);

  // Lokalny stan modala (żeby można było klikać bez zapisu)
  const [draft, setDraft] = useState<Omit<ConsentState, 'timestamp' | 'version'>>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const current = consent ?? defaultConsent();
    setDraft({
      necessary: true,
      functional: current.functional,
      analytics: current.analytics,
      marketing: current.marketing,
    });
  }, [consent]);

  function acceptAll() {
    const next: ConsentState = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };
    saveConsent(next);
    setConsent(next);
    setOpen(false);
    window.dispatchEvent(new CustomEvent('cookie-consent-updated'));
  }

  function rejectAll() {
    const next: ConsentState = {
      ...defaultConsent(),
      functional: false,
      analytics: false,
      marketing: false,
    };
    saveConsent(next);
    setConsent(next);
    setOpen(false);
    window.dispatchEvent(new CustomEvent('cookie-consent-updated'));
  }

  function saveDraft() {
    const next: ConsentState = {
      necessary: true,
      functional: Boolean(draft.functional),
      analytics: Boolean(draft.analytics),
      marketing: Boolean(draft.marketing),
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };
    saveConsent(next);
    setConsent(next);
    setOpen(false);
    window.dispatchEvent(new CustomEvent('cookie-consent-updated'));
  }

  function resetConsent() {
    localStorage.removeItem(CONSENT_KEY);
    setConsent(null);
    setOpen(false);
    window.dispatchEvent(new CustomEvent('cookie-consent-updated'));
  }

  return (
    <>
      {shouldShowBanner && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur px-4 py-4 shadow"
          role="dialog"
          aria-live="polite"
          aria-label="Informacja o plikach cookies"
        >
          <div className="mx-auto max-w-5xl flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm leading-relaxed text-gray-800">
              <div className="font-semibold">Cookies i podobne technologie</div>
              <div>
                Używam cookies niezbędnych do działania strony oraz – za Twoją zgodą – cookies analitycznych i marketingowych.
                Zgodę możesz w każdej chwili zmienić w ustawieniach.
              </div>
              <div className="mt-1">
                <a className="underline" href="/polityka-cookies">Polityka cookies</a>
                <span className="mx-2">·</span>
                <button className="underline" type="button" onClick={() => setOpen(true)}>
                  Ustawienia
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <button
                type="button"
                className="rounded-md border px-4 py-2 text-sm"
                onClick={rejectAll}
              >
                Odrzuć
              </button>
              <button
                type="button"
                className="rounded-md border px-4 py-2 text-sm"
                onClick={() => setOpen(true)}
              >
                Dostosuj
              </button>
              <button
                type="button"
                className="rounded-md bg-black px-4 py-2 text-sm text-white"
                onClick={acceptAll}
              >
                Akceptuj wszystkie
              </button>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-5 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">Ustawienia cookies</div>
                <div className="mt-1 text-sm text-gray-700">
                  Wybierz, na co wyrażasz zgodę. Niezbędne cookies są zawsze włączone.
                </div>
              </div>
              <button
                type="button"
                className="rounded-md border px-3 py-1 text-sm"
                onClick={() => setOpen(false)}
              >
                Zamknij
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <ToggleRow
                title="Niezbędne"
                description="Wymagane do działania strony (bez zgody)."
                checked
                disabled
                onChange={() => {}}
              />
              <ToggleRow
                title="Funkcjonalne"
                description="Zapamiętywanie preferencji (np. ustawienia)."
                checked={draft.functional}
                onChange={(v) => setDraft((d) => ({ ...d, functional: v }))}
              />
              <ToggleRow
                title="Analityczne"
                description="Pomiar ruchu i statystyki (np. Google Analytics) – tylko po zgodzie."
                checked={draft.analytics}
                onChange={(v) => setDraft((d) => ({ ...d, analytics: v }))}
              />
              <ToggleRow
                title="Marketingowe"
                description="Remarketing i reklamy – tylko po zgodzie."
                checked={draft.marketing}
                onChange={(v) => setDraft((d) => ({ ...d, marketing: v }))}
              />
            </div>

            <div className="mt-5 flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
              <button
                type="button"
                className="rounded-md border px-4 py-2 text-sm"
                onClick={resetConsent}
              >
                Wycofaj zgodę i pokaż banner ponownie
              </button>

              <div className="flex flex-col gap-2 md:flex-row">
                <button
                  type="button"
                  className="rounded-md border px-4 py-2 text-sm"
                  onClick={rejectAll}
                >
                  Odrzuć wszystkie
                </button>
                <button
                  type="button"
                  className="rounded-md bg-black px-4 py-2 text-sm text-white"
                  onClick={saveDraft}
                >
                  Zapisz wybór
                </button>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-600">
              W każdej chwili możesz zmienić decyzję na stronie „Polityka cookies”.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ToggleRow(props: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  const { title, description, checked, disabled, onChange } = props;
  return (
    <div className="flex items-start justify-between gap-4 rounded-md border p-3">
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-gray-700">{description}</div>
      </div>
      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="text-xs">{checked ? 'Włączone' : 'Wyłączone'}</span>
      </label>
    </div>
  );
}
