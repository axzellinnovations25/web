import { FileText } from "lucide-react";
import { useState } from "react";
import { useClinic } from "../../context/ClinicContext";
import { formatDate } from "../../utils";
import { Button } from "../../components/ui/Button";
import { Textarea } from "../../components/ui/Input";
import { AdminPageShell, DetailList, EmptyBlock, Panel, StatusPill, Toolbar } from "./shared";

export function PatientsPage() {
  const { patients, appointments, prescriptions, savePatientNote } = useClinic();
  const [selectedId, setSelectedId] = useState<string | undefined>(patients[0]?.id);
  const patient = patients.find((item) => item.id === selectedId) ?? patients[0];
  const history = appointments.filter((appointment) => appointment.patientId === patient?.id);
  const files = prescriptions.filter((item) => item.patientId === patient?.id);

  return (
    <AdminPageShell
      eyebrow="Patients"
      title="Patient records and follow-up history"
      description="A central workspace for patient identity, visit history, record notes, and attached prescription/report files."
    >
      <div className="grid gap-6 xl:grid-cols-[330px_1fr]">
        <Panel title="Patient directory" description="Search and select a patient record to inspect visit history.">
          <Toolbar searchPlaceholder="Search patients by name, phone, or email" />
          <div className="mt-6 space-y-3">
            {patients.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setSelectedId(entry.id)}
                className={`w-full rounded-[1.5rem] border px-4 py-4 text-left transition ${
                  entry.id === patient?.id
                    ? "border-accent bg-accent text-white"
                    : "border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100"
                }`}
              >
                <div className="font-bold">{entry.name}</div>
                <div className={`mt-1 text-sm ${entry.id === patient?.id ? "text-white/80" : "text-slate-500"}`}>{entry.phone}</div>
              </button>
            ))}
          </div>
        </Panel>

        {patient ? (
          <div className="space-y-6">
            <Panel
              title={patient.name}
              description="Primary record summary with direct access to notes and contact details."
              action={<Button variant="secondary"><FileText className="mr-2 size-4" />Upload prescription</Button>}
            >
              <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-4">
                  <DetailList
                    items={[
                      { label: "Phone", value: patient.phone },
                      { label: "Email", value: patient.email ?? "Not provided" },
                      { label: "Total visits", value: String(patient.totalVisits) },
                      { label: "Last visit", value: patient.lastVisit ? formatDate(patient.lastVisit) : "No previous visit" },
                    ]}
                  />
                </div>
                <div>
                  <div className="mb-3 text-xs font-bold uppercase tracking-[0.26em] text-slate-400">Clinical note</div>
                  <Textarea
                    rows={8}
                    value={patient.notes ?? ""}
                    onChange={(event) => savePatientNote(patient.id, event.target.value)}
                    placeholder="Add patient-specific operational or clinical context"
                  />
                </div>
              </div>
            </Panel>

            <div className="grid gap-6 xl:grid-cols-2">
              <Panel title="Visit history" description="Past and upcoming appointments connected to this patient.">
                <div className="space-y-3">
                  {history.length ? history.map((appointment) => (
                    <div key={appointment.id} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="font-semibold text-slate-900">{formatDate(appointment.date)} | {appointment.startTime}</div>
                          <div className="mt-1 text-sm text-slate-500">{appointment.referenceNumber}</div>
                        </div>
                        <StatusPill status={appointment.status} />
                      </div>
                    </div>
                  )) : <EmptyBlock title="No visits yet" description="Appointments for this patient will appear here." />}
                </div>
              </Panel>

              <Panel title="Prescriptions and reports" description="Files and note metadata attached to patient visits.">
                <div className="space-y-3">
                  {files.length ? files.map((file) => (
                    <div key={file.id} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                      <div className="font-semibold text-slate-900">{file.fileName}</div>
                      <div className="mt-2 text-sm text-slate-500">{file.notes || "No file note provided."}</div>
                    </div>
                  )) : <EmptyBlock title="No files uploaded" description="Prescription and report uploads will appear here." />}
                </div>
              </Panel>
            </div>
          </div>
        ) : null}
      </div>
    </AdminPageShell>
  );
}
