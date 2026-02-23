"use client";

interface SubmissionsTabProps {
  formId: number;
}

export function SubmissionsTab({ formId }: SubmissionsTabProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <svg
            className="h-24 w-24 text-muted-foreground opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No completed submissions yet
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Your form is published and ready to be shared with the world!
        </p>
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
          Share
        </button>
      </div>
    </div>
  );
}
