"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { TEMPLATES, CATEGORIES, type Template } from "@/lib/templates-data";

export function TemplatesGrid() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTemplates = useMemo(() => {
    if (activeCategory === "all") {
      return TEMPLATES;
    }
    if (activeCategory === "by-my-team") {
      return []; // No templates in "By my team" for now
    }
    return TEMPLATES.filter(
      (t) => t.category === activeCategory || t.category === "all",
    );
  }, [activeCategory]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Explore form &amp; survey templates
        </h1>
        <p className="text-lg text-muted-foreground">
          Explore, pick, and customize templates to your needs.
        </p>
        <p className="text-muted-foreground">
          Discover how to{" "}
          <a href="#" className="underline text-primary hover:text-primary/80">
            use templates
          </a>
          ,{" "}
          <a href="#" className="underline text-primary hover:text-primary/80">
            create your own
          </a>{" "}
          or{" "}
          <a href="#" className="underline text-primary hover:text-primary/80">
            submit your template
          </a>{" "}
          to the gallery.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-12">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              activeCategory === category.id
                ? "bg-primary text-primary-foreground border-primary border"
                : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-96">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="h-16 w-16 text-muted-foreground mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-lg font-medium text-foreground">
              No templates yet
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}

function TemplateCard({ template }: { template: Template }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer h-full flex flex-col">
      {/* Template Preview */}
      <div className="bg-gradient-to-br from-muted to-muted-foreground h-40 flex items-center justify-center text-muted-foreground text-sm">
        <div className="text-center">
          <svg
            className="h-12 w-12 mx-auto text-muted-foreground/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      </div>

      {/* Template Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-3">
          {template.name}
        </h3>

        {/* Creator and Likes */}
        <div className="flex items-center justify-between text-xs mt-auto pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-medium">
              {template.creator.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-muted-foreground truncate">
              {template.creator.name}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Heart className="h-3 w-3" />
            <span>{template.likes.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
