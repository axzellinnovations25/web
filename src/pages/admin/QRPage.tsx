import { Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useClinic } from "../../context/ClinicContext";
import { Button } from "../../components/ui/Button";
import { AdminPageShell, DetailList, Panel } from "./shared";

export function QRPage() {
  const { clinic } = useClinic();
  const bookingUrl = `https://${clinic.slug}.example.com/booking`;

  return (
    <AdminPageShell
      eyebrow="QR Studio"
      title="Print-ready booking access"
      description="Generate a reception-quality QR asset that sends patients directly into the booking flow."
      actions={<Button variant="secondary"><Download className="mr-2 size-4" />Download PNG</Button>}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="QR preview" description="Poster-style preview with centered code and booking target.">
          <div className="rounded-[1.75rem] bg-slate-50 p-8">
            <div className="mx-auto flex max-w-md flex-col items-center rounded-[1.75rem] bg-white px-8 py-10 text-center shadow-soft">
              <div className="text-xs font-bold uppercase tracking-[0.26em] text-slate-400">Scan to book</div>
              <div className="mt-3 text-2xl font-extrabold text-slate-950">{clinic.name}</div>
              <div className="mt-2 text-sm text-slate-500">Instant appointment access from reception, posters, or business cards.</div>
              <div className="mt-8 rounded-[1.5rem] bg-slate-50 p-5">
                <QRCodeSVG value={bookingUrl} size={240} />
              </div>
              <div className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{clinic.slug}.example.com</div>
            </div>
          </div>
        </Panel>

        <Panel title="Print metadata" description="Output controls and destination details for your design/export pipeline.">
          <DetailList
            items={[
              { label: "Destination URL", value: bookingUrl },
              { label: "Suggested uses", value: "Poster, desk card, business card" },
              { label: "Logo center", value: "Optional next step" },
              { label: "Asset variants", value: "PNG, SVG, print sheet" },
            ]}
          />
        </Panel>
      </div>
    </AdminPageShell>
  );
}
