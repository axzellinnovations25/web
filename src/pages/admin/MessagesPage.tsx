import { BadgeCheck, CircleDot, Download, MailOpen } from "lucide-react";
import { useState } from "react";
import { useClinic } from "../../context/ClinicContext";
import { formatDate } from "../../utils";
import { Button } from "../../components/ui/Button";
import { AdminPageShell, EmptyBlock, Panel, StatCard } from "./shared";

function statusTone(status: "new" | "read" | "resolved") {
  if (status === "resolved") return "bg-emerald-100 text-emerald-700";
  if (status === "read") return "bg-sky-100 text-sky-700";
  return "bg-amber-100 text-amber-700";
}

export function MessagesPage() {
  const { contactMessages, updateContactMessageStatus } = useClinic();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const newCount = contactMessages.filter((m) => m.status === "new").length;
  const readCount = contactMessages.filter((m) => m.status === "read").length;
  const resolvedCount = contactMessages.filter((m) => m.status === "resolved").length;

  return (
    <AdminPageShell
      eyebrow="Messages"
      title="Contact inbox"
      description="Review contact form submissions and track which inquiries need a response."
      actions={
        <Button variant="secondary">
          <Download className="mr-1.5 size-4" />
          Export
        </Button>
      }
    >
      <section className="grid gap-3 md:grid-cols-3">
        <StatCard label="New" value={String(newCount)} detail="Needs first response" icon={CircleDot} tone="amber" />
        <StatCard label="Read" value={String(readCount)} detail="Opened but unresolved" icon={MailOpen} />
        <StatCard label="Resolved" value={String(resolvedCount)} detail="Handled inquiries" icon={BadgeCheck} tone="slate" />
      </section>

      <Panel title="Inbox" description="Contact form submissions — click to expand.">
        {contactMessages.length ? (
          <div className="space-y-3">
            {contactMessages.map((message) => {
              const isExpanded = expandedId === message.id;
              return (
                <div
                  key={message.id}
                  className={`rounded-xl border bg-white transition-all ${message.status === "new" ? "border-amber-200" : "border-slate-200"}`}
                >
                  {/* Header row — always visible */}
                  <button
                    className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                    onClick={() => setExpandedId(isExpanded ? null : message.id)}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900">{message.patientName}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusTone(message.status)}`}>
                          {message.status}
                        </span>
                        <span className="text-[11px] text-slate-400">{formatDate(message.createdAt)}</span>
                      </div>
                      <div className="mt-0.5 text-sm font-medium text-slate-700">{message.subject}</div>
                      {!isExpanded && (
                        <p className="mt-1 line-clamp-2 text-xs text-slate-400">{message.message}</p>
                      )}
                    </div>
                    <span className="mt-1 shrink-0 text-xs font-medium text-slate-400">{isExpanded ? "▲" : "▼"}</span>
                  </button>

                  {/* Expanded body */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 px-5 pb-4 pt-3">
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>{message.phone}</span>
                        <span>{message.email || "No email"}</span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{message.message}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(["new", "read", "resolved"] as const).map((status) => (
                          <button
                            key={status}
                            onClick={() => updateContactMessageStatus(message.id, status)}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                              message.status === status
                                ? "bg-accent text-white"
                                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyBlock title="No messages yet" description="Contact form submissions will appear here." />
        )}
      </Panel>
    </AdminPageShell>
  );
}
