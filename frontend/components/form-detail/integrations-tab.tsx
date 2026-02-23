"use client";

export function IntegrationsTab() {
  const integrations = [
    {
      name: "Google Sheets",
      description: "Send submissions to a sheet",
      icon: "📊",
      color: "bg-green-50",
    },
    {
      name: "Notion",
      description: "Send submissions to Notion",
      icon: "📝",
      color: "bg-gray-50",
    },
    {
      name: "Airtable",
      description: "Send submissions to Airtable",
      icon: "🎨",
      color: "bg-yellow-50",
    },
    {
      name: "Webhooks",
      description: "Send events for new submissions to HTTP endpoints",
      icon: "🔗",
      color: "bg-purple-50",
    },
    {
      name: "Slack",
      description: "Send Slack messages for new submissions",
      icon: "💬",
      color: "bg-pink-50",
    },
    {
      name: "Discord",
      description: "Send Discord messages for new submissions",
      icon: "🎮",
      color: "bg-indigo-50",
    },
    {
      name: "Zapier",
      description: "Send submissions to your favorite tools",
      icon: "⚡",
      color: "bg-orange-50",
    },
    {
      name: "Make",
      description: "Send submissions to your favorite tools",
      icon: "🔧",
      color: "bg-purple-50",
    },
    {
      name: "n8n",
      description: "Send submissions to your favorite tools",
      icon: "🔴",
      color: "bg-red-50",
    },
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Discover integrations
        </h2>
        <p className="text-sm text-muted-foreground">
          Make Tally even more powerful by using these tools. Check out our{" "}
          <button className="text-primary hover:text-primary/80">
            roadmap
          </button>{" "}
          for upcoming integrations and to request new ones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="border border-border rounded-lg p-6 hover:border-primary cursor-pointer transition-colors"
          >
            <div
              className={`${integration.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4`}
            >
              {integration.icon}
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              {integration.name}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {integration.description}
            </p>
            <button className="text-sm text-primary hover:text-primary/80 font-medium">
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
