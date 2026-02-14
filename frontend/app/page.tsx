import Link from "next/link";
import { Ban } from "lucide-react";
import { Space_Grotesk } from "next/font/google";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-7 w-7 rounded-lg bg-foreground text-background flex items-center justify-center font-semibold">
            T
          </div>
          <span className="text-foreground font-medium">Tally</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <button
            aria-disabled="true"
            className="group inline-flex items-center gap-2 text-foreground hover:text-foreground cursor-not-allowed"
          >
            Product
            <span className="opacity-0 transition-opacity group-hover:opacity-100">
              <Ban className="h-3.5 w-3.5 text-destructive" />
            </span>
          </button>
          <button
            aria-disabled="true"
            className="group inline-flex items-center gap-2 text-foreground hover:text-foreground cursor-not-allowed"
          >
            Templates
            <span className="opacity-0 transition-opacity group-hover:opacity-100">
              <Ban className="h-3.5 w-3.5 text-destructive" />
            </span>
          </button>
          <button
            aria-disabled="true"
            className="group inline-flex items-center gap-2 text-foreground hover:text-foreground cursor-not-allowed"
          >
            Pricing
            <span className="opacity-0 transition-opacity group-hover:opacity-100">
              <Ban className="h-3.5 w-3.5 text-destructive" />
            </span>
          </button>
          <Link
            href="/signin"
            className="text-foreground font-medium hover:text-foreground/80"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col items-center px-6 pt-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
          Build forms that feel like docs
        </div>
        <h1
          className={`${displayFont.className} mt-6 text-5xl font-semibold tracking-tight text-foreground md:text-6xl`}
        >
          Create beautiful forms in minutes
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          A friendly form builder that feels like writing. Share a link, collect
          responses, and keep everything simple.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/builder"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Try for free
          </Link>
          <span className="text-xs text-muted-foreground">
            No sign in required
          </span>
        </div>

        <div className="mt-16 grid w-full max-w-4xl grid-cols-1 gap-6 text-left md:grid-cols-3">
          {[
            {
              title: "Start simple",
              copy: "Press Enter to add blocks and keep writing.",
            },
            {
              title: "Share instantly",
              copy: "Publish and send a link in seconds.",
            },
            {
              title: "Collect responses",
              copy: "See responses in one place.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="text-sm font-semibold text-foreground">
                {card.title}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {card.copy}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
