import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { Space_Grotesk } from "next/font/google";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Page() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white text-black">
        {/* Header */}
        <header className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-foreground font-bold text-xl">
              tally<span className="text-pink-500">*</span>
            </span>
          </div>
          <nav className="flex flex-wrap items-center gap-8 text-sm">
            <a
              href="#pricing"
              className="text-gray-700 hover:text-black transition"
            >
              Pricing
            </a>
            <Link
              href="/signin"
              className="text-gray-700 hover:text-black transition"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-gray-700 hover:text-black transition"
            >
              Sign up
            </Link>
            <Link
              href="/builder"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition"
            >
              Create form
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="relative mx-auto max-w-6xl px-6 pt-12 pb-20">
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 text-6xl opacity-40 select-none pointer-events-none">
            💬
          </div>
          <div className="absolute top-40 right-20 text-7xl opacity-40 select-none pointer-events-none">
            ✅
          </div>
          <div className="absolute bottom-40 left-5 text-5xl opacity-30 select-none pointer-events-none">
            👤
          </div>
          <div className="absolute bottom-32 right-10 text-6xl opacity-30 select-none pointer-events-none">
            ⭐
          </div>

          {/* Main Content */}
          <div className="flex flex-col items-center text-center mx-auto max-w-4xl relative z-10">
            <h1
              className={`${displayFont.className} text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-2`}
            >
              The simplest way to create forms
            </h1>

            {/* Pink wavy underline decoration */}
            <div className="h-1 w-32 bg-pink-500 rounded-full mx-auto mb-6 hover:w-40 transition-all"></div>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Say goodbye to boring forms. Meet Tally — the free, intuitive form
              builder you've been looking for.
            </p>

            {/* CTA Section */}
            <div className="flex flex-col items-center gap-2 mb-16">
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition group"
              >
                Create a free form
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </Link>
              <p className="text-sm text-gray-600">No signup required</p>
            </div>

            {/* Form Preview Card */}
            <div className="w-full max-w-xl bg-gray-50 border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {/* Mac header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>

              {/* Form preview content */}
              <div className="p-8 space-y-6">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    Input blocks
                  </p>
                  <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition">
                    <span className="text-gray-400">@</span>
                    <span className="text-gray-700 font-medium">E-mail</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    Embed blocks
                  </p>
                  <div className="space-y-2">
                    <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition opacity-70">
                      <span>🖼️</span>
                      <span className="text-gray-700 text-sm">Image</span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition opacity-70">
                      <span>🎥</span>
                      <span className="text-gray-700 text-sm">Video</span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition opacity-70">
                      <span>🔊</span>
                      <span className="text-gray-700 text-sm">Audio</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Floating Scope Document Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="/scope_doc.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
              aria-label="View scope document"
            >
              <FileText className="h-6 w-6" />
            </a>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Application scope document</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
