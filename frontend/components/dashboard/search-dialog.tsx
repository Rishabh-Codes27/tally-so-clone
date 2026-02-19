"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Plus, ArrowRight, Folder } from "lucide-react";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleAction = (path: string) => {
    onOpenChange(false);
    router.push(path);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>

        <div className="border-b border-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for forms and help articles"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              autoFocus
            />
          </div>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <div className="text-xs font-medium text-muted-foreground mb-2">
              Actions
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleAction("/builder")}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-left"
              >
                <Plus className="h-4 w-4" />
                <span>New form</span>
              </button>
              <button
                onClick={() => handleAction("/dashboard")}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-left"
              >
                <Folder className="h-4 w-4" />
                <span>New workspace</span>
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-muted-foreground mb-2">
              Navigation
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleAction("/dashboard")}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-left"
              >
                <ArrowRight className="h-4 w-4" />
                <span>Go to home</span>
              </button>
              <button
                onClick={() => handleAction("/dashboard")}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-left"
              >
                <ArrowRight className="h-4 w-4" />
                <span>Go to templates</span>
              </button>
              <button
                onClick={() => handleAction("/dashboard")}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-left"
              >
                <ArrowRight className="h-4 w-4" />
                <span>Go to settings</span>
              </button>
              <button
                onClick={() => handleAction("/dashboard")}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-left"
              >
                <ArrowRight className="h-4 w-4" />
                <span>Go to help center</span>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
