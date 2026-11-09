"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Check, MessageCircle, Phone, Send } from "lucide-react";
import {
  siteConfig,
  telHref,
  whatsappHref,
  services,
  locations,
} from "@/lib/site-config";
import {
  leadFormConsentCopy,
  leadFormErrorCopy,
  leadFormMessageCopy,
  leadFormSuccessCopy,
  leadFormValidationCopy,
  privacyPath,
  thanksPath,
} from "@/lib/content";
import { ISRAELI_PHONE_PATTERN, isIsraeliPhone } from "@/lib/phone";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { trackEvent } from "@ishub/site-kit/analytics";

/** Reasons `lead_error` reports (docs/event-taxonomy.md) — a delivery failure never carries PII. */
type LeadErrorReason = "network" | `http_${number}`;

/** Where the form sits — the `placement` dimension of every event it pushes. */
type LeadPlacement = "hero" | "contact" | "form";

type FieldName = "name" | "phone";
type FieldErrors = Partial<Record<FieldName, string>>;

/** The `site` dimension: the shared GTM container tells fleet sites apart by it. */
const SITE_ID = "dangates";

/** The city select's value for a town outside the published locations — `city: "other"` on lead_submit. */
const CITY_OTHER = "other";

/**
 * Push a form event. Every event carries `form`, `page` and `site`; callers add only the
 * non-PII dimensions (placement, service slug, city slug, reason). Never the name, phone or
 * message (golden rule 10).
 */
function track(event: string, params: Record<string, string> = {}) {
  trackEvent(event, {
    form: "lead",
    page: window.location.pathname,
    site: SITE_ID,
    ...params,
  });
}

/** A FormData entry as a string — `""` for a missing key or a File. */
function text(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === "string" ? value : "";
}

/** The message for an invalid field, or `null` when the value is fine. */
function validateField(field: FieldName, value: string): string | null {
  const v = value.trim();
  if (field === "name") return v ? null : leadFormValidationCopy.nameRequired;
  if (!v) return leadFormValidationCopy.phoneRequired;
  return isIsraeliPhone(v) ? null : leadFormValidationCopy.phoneInvalid;
}

function isFieldName(name: string): name is FieldName {
  return name === "name" || name === "phone";
}

/**
 * Primary lead/quote form (brief G1). Low-friction: name + phone required.
 *
 * Delivers via Web3Forms (https://api.web3forms.com/submit) so the lead is emailed to the
 * business inbox (contact.email) from any static host — no backend/PHP needed. The PUBLIC
 * access key comes from the manifest (siteConfig.formAccessKey), with a NEXT_PUBLIC_WEB3FORMS_KEY
 * env override for local dev. WhatsApp is offered as a one-tap alternative and, if delivery
 * fails, as a real link in the error block. Honeypot blocks bots.
 *
 * Validation is per field (backlog §8.1): `noValidate` stays so the messages are Hebrew, and each
 * invalid field carries aria-invalid + aria-describedby; focus moves to the first one on submit.
 * A confirmed send pushes `lead_submit`, then navigates to the /תודה/ route (§8.3).
 */
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_KEY =
  siteConfig.formAccessKey ?? process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

export function LeadForm({
  className,
  placement = "form",
}: {
  className?: string;
  placement?: LeadPlacement;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [fallbackWhatsapp, setFallbackWhatsapp] = useState<string | null>(null);
  const started = useRef(false);

  /** `form_start`: once, on the first focus or input of a real field — never the honeypot. */
  function handleInteraction(e: React.SyntheticEvent<HTMLFormElement>) {
    const target = e.target;
    if (
      !(
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement
      )
    )
      return;
    if (!target.name || target.name === "company") return;
    if (!started.current) {
      started.current = true;
      track("form_start", { placement });
    }
  }

  /** Clear a field's error as soon as what is typed becomes valid. */
  function handleInput(e: React.FormEvent<HTMLFormElement>) {
    handleInteraction(e);
    const target = e.target;
    if (!(target instanceof HTMLInputElement) || !isFieldName(target.name)) return;
    const field = target.name;
    if (errors[field] && validateField(field, target.value) === null) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function buildWhatsapp(parts: {
    name: string;
    phone: string;
    service: string;
    city: string;
    message: string;
  }): string {
    const copy = leadFormMessageCopy;
    const body = [
      `${copy.greeting} ${parts.name}.`,
      parts.service ? `${copy.service} ${parts.service}.` : "",
      parts.city ? `${copy.city} ${parts.city}.` : "",
      parts.message,
      `${copy.phone} ${parts.phone}`,
    ]
      .filter(Boolean)
      .join("\n");
    return whatsappHref(body);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    if (text(data, "company").length) return; // honeypot
    track("form_submit_attempt", { placement });

    const name = text(data, "name").trim();
    const phone = text(data, "phone").trim();

    const found: FieldErrors = {};
    const nameError = validateField("name", name);
    const phoneError = validateField("phone", phone);
    if (nameError) found.name = nameError;
    if (phoneError) found.phone = phoneError;
    const firstInvalid: FieldName | null = found.name
      ? "name"
      : found.phone
        ? "phone"
        : null;
    if (firstInvalid) {
      // Render the aria-invalid / aria-describedby wiring BEFORE focusing, so the screen reader
      // announces the message together with the field.
      flushSync(() => setErrors(found));
      document.getElementById(`lf-${firstInvalid}`)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");

    const service = services.find((s) => s.slug === text(data, "service"));
    // The city select carries a location slug, CITY_OTHER for a town outside the published set,
    // or "" when left blank. `cityName` goes to the email and WhatsApp; `cityValue` to the event.
    const cityRaw = text(data, "city");
    const isOtherCity = cityRaw === CITY_OTHER;
    const city = locations.find((l) => l.slug === cityRaw);
    const cityName = isOtherCity ? leadFormValidationCopy.cityOther : (city?.name ?? "");
    const cityValue = isOtherCity ? CITY_OTHER : (city?.slug ?? "");
    const message = text(data, "message");

    function reportDeliveryFailure(reason: LeadErrorReason) {
      setStatus("error");
      // A real link the visitor activates — it cannot be popup-blocked, and the click is what
      // pushes `whatsapp_click` (see the fallback button below).
      setFallbackWhatsapp(
        buildWhatsapp({
          name,
          phone,
          service: service?.name ?? "",
          city: cityName,
          message,
        }),
      );
      track("lead_error", { placement, reason });
    }

    // No access key (local dev only): simulate so `next dev` works. Production builds always
    // ship a provisioned key, so an empty key in production is a misconfig — surface the
    // WhatsApp fallback rather than silently pretending the lead was sent.
    if (!WEB3FORMS_KEY) {
      if (process.env.NODE_ENV !== "production") {
        await new Promise((r) => setTimeout(r, 600));
        setStatus("done");
        return;
      }
      reportDeliveryFailure("network");
      return;
    }

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `${leadFormMessageCopy.emailSubject} ${name}`,
          from_name: siteConfig.name,
          name,
          phone,
          service: service?.name ?? leadFormMessageCopy.notSpecified,
          city: cityName || leadFormMessageCopy.notSpecified,
          message: message || "—",
          page: window.location.pathname,
        }),
      });
      const result: { success?: boolean } = await res.json();
      if (!res.ok || !result.success) {
        reportDeliveryFailure(`http_${res.status}`);
        return;
      }
    } catch {
      // Offer WhatsApp so the lead is never lost.
      reportDeliveryFailure("network");
      return;
    }

    // Past this point the lead IS delivered. Success handling stays OUTSIDE the try so that
    // nothing here can reach the catch above and report a delivered lead as a failure —
    // analytics must never share a failure path with lead delivery.
    setStatus("done");
    // GTM conversion hook: fires only on a CONFIRMED send (the dev simulation above does not),
    // and BEFORE the navigation, so the event is in the dataLayer when the page unloads.
    track("lead_submit", {
      service: service?.slug ?? "",
      city: cityValue,
      placement,
    });
    // Full page load: the /תודה/ page view is the countable conversion; the inline success
    // block below stays as the fallback if navigation is blocked.
    window.location.assign(encodeURI(thanksPath));
  }

  if (status === "done") {
    return (
      <div className={cn("rounded-xl bg-green-50 p-6 text-center", className)}>
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
          <Check className="h-6 w-6" aria-hidden />
        </span>
        <p className="mt-3 font-heading text-lg font-bold text-primary">
          {leadFormSuccessCopy.heading}
        </p>
        <p className="mt-1 text-sm text-gray-600">{leadFormSuccessCopy.body}</p>
      </div>
    );
  }

  const fieldClass = (invalid: boolean) =>
    cn(
      "w-full rounded-lg border px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:outline-none",
      invalid
        ? "border-red-600 focus:border-red-600 focus:ring-red-600/40"
        : "border-gray-300 focus:border-secondary focus:ring-secondary/40",
    );

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={handleInteraction}
      onInput={handleInput}
      className={cn("space-y-4", className)}
      aria-busy={status === "sending"}
      noValidate
    >
      <div>
        <label htmlFor="lf-name" className="mb-1 block text-sm font-medium text-gray-700">
          שם מלא
        </label>
        <input
          id="lf-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "lf-name-error" : undefined}
          className={fieldClass(Boolean(errors.name))}
          placeholder="ישראל ישראלי"
        />
        {errors.name && (
          <p id="lf-name-error" className="mt-1 text-sm font-medium text-red-700">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="lf-phone"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          טלפון
        </label>
        <input
          id="lf-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          pattern={ISRAELI_PHONE_PATTERN}
          required
          dir="ltr"
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? "lf-phone-error" : undefined}
          className={cn(fieldClass(Boolean(errors.phone)), "text-end")}
          placeholder="050-0000000"
        />
        {errors.phone && (
          <p id="lf-phone-error" className="mt-1 text-sm font-medium text-red-700">
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="lf-service"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          השירות שמעניין אתכם (אופציונלי)
        </label>
        <select
          id="lf-service"
          name="service"
          className={fieldClass(false)}
          defaultValue=""
        >
          <option value="">בחירת שירות…</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="lf-city" className="mb-1 block text-sm font-medium text-gray-700">
          {leadFormValidationCopy.citySelect}
        </label>
        <select id="lf-city" name="city" className={fieldClass(false)} defaultValue="">
          <option value="">{leadFormValidationCopy.cityPlaceholder}</option>
          {locations.map((l) => (
            <option key={l.slug} value={l.slug}>
              {l.name}
            </option>
          ))}
          <option value={CITY_OTHER}>{leadFormValidationCopy.cityOther}</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="lf-message"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          פרטים על הבעיה (אופציונלי)
        </label>
        <textarea
          id="lf-message"
          name="message"
          rows={3}
          className={fieldClass(false)}
          placeholder="לדוגמה: שער נגרר שלא נסגר עד הסוף / מנוע שלא מגיב…"
        />
      </div>

      {/* Honeypot */}
      <div className="hidden" aria-hidden>
        <label htmlFor="lf-company">אל תמלאו שדה זה</label>
        <input
          id="lf-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Button
        type="submit"
        data-cta="form-submit"
        variant="accent"
        size="lg"
        className="w-full"
        disabled={status === "sending"}
      >
        <Send className="h-5 w-5" aria-hidden />
        {status === "sending"
          ? "שולח…"
          : status === "error"
            ? leadFormErrorCopy.retryLabel
            : "שליחה וקבלת הצעת מחיר"}
      </Button>

      {/* The consent notice (backlog §8.2) — a notice, not a checkbox; copy in lib/content.ts. */}
      <p className="text-center text-xs text-gray-600">
        {leadFormConsentCopy.text} {leadFormConsentCopy.moreLead}{" "}
        <a href={privacyPath} className="font-semibold text-secondary underline">
          {leadFormConsentCopy.linkLabel}
        </a>
        .
      </p>

      <p className="text-center text-xs text-gray-500">
        מעדיפים וואטסאפ?{" "}
        <a
          href={whatsappHref("היי, אני מעוניין/ת בהצעת מחיר לתיקון/התקנת שער חשמלי")}
          data-cta="form-whatsapp"
          className="inline-flex items-center gap-1 font-semibold text-whatsapp hover:underline"
        >
          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
          שלחו לנו הודעה
        </a>
      </p>

      {status === "error" && (
        <div
          role="alert"
          className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <p className="font-semibold">{leadFormErrorCopy.heading}</p>
          <p>{leadFormErrorCopy.body}</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              href={fallbackWhatsapp ?? whatsappHref()}
              data-cta="form-whatsapp"
              variant="whatsapp"
              size="lg"
              onClick={() =>
                track("whatsapp_click", { cta: "form-whatsapp", placement: "form" })
              }
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              {leadFormErrorCopy.whatsappLabel}
            </Button>
            <Button href={telHref} data-cta="form-call" variant="outline" size="lg">
              <Phone className="h-4 w-4" aria-hidden />
              <span dir="ltr">{leadFormErrorCopy.callLabel}</span>
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
