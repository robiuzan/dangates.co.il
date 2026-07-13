import { Check, MessageCircle, Phone } from "lucide-react";
import { siteConfig, telHref, whatsappHref } from "@/lib/site-config";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LeadForm } from "@/components/forms/LeadForm";

const points = ["שירות מהיר ואמין", "אחריות מלאה", "זמינות 24/7 לחירום"];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(60% 60% at 80% 0%, #d21f27 0%, transparent 60%), radial-gradient(50% 50% at 0% 100%, #520406 0%, transparent 70%)",
        }}
        aria-hidden
      />
      <Container className="relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-semibold text-accent-300">
            ניסיון רב שנים · מרכז הארץ ופריסה ארצית · זמינות 24/7
          </p>
          <h1 className="font-heading text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            דן שערים חשמליים – תיקון והתקנה מקצועית
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">
            מתמחים בתיקון והתקנת שערים חשמליים בהתאמה אישית לשירות מהיר ואמין — עם אחריות
            מלאה וזמינות 24/7 לקריאות חירום.
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {points.map((p) => (
              <li
                key={p}
                className="flex items-center gap-2 text-sm font-medium text-white/90"
              >
                <Check className="h-4 w-4 text-accent-400" aria-hidden />
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={telHref} variant="accent" size="lg">
              <Phone className="h-5 w-5" aria-hidden />
              חייגו עכשיו: <span dir="ltr">{siteConfig.phone}</span>
            </Button>
            <Button
              href={whatsappHref("היי, אני מעוניין/ת בהצעת מחיר לתיקון/התקנת שער חשמלי")}
              variant="whatsapp"
              size="lg"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              וואטסאפ
            </Button>
          </div>
        </div>

        {/* Lead form card */}
        <div className="rounded-2xl bg-white p-6 text-gray-900 shadow-xl sm:p-8">
          <h2 className="font-heading text-xl font-bold text-primary">
            קבלו הצעת מחיר חינם
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            השאירו פרטים ונחזור אליכם עם פתרון — ללא התחייבות.
          </p>
          <div className="mt-5">
            <LeadForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
