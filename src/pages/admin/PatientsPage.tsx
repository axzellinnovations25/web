import { FileText, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useClinic } from "../../context/ClinicContext";
import { formatDate } from "../../utils";
import { Button } from "../../components/ui/Button";
import { Textarea } from "../../components/ui/Input";
import { AdminPageShell, DetailList, EmptyBlock, Panel, StatusPill, Toolbar } from "./shared";

export function PatientsPage() {
  const { patients, appointments, prescriptions, savePatientNote, addPrescription } = useClinic();
  const [selectedId, setSelectedId] = useState<string | undefined>(patients[0]?.id);
  const patient = patients.find((item) => item.id === selectedId) ?? patients[0];
  const history = appointments.filter((appointment) => appointment.patientId === patient?.id);
  const files = prescriptions.filter((item) => item.patientId === patient?.id);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadNote, setUploadNote] = useState("");

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setPendingFile(file);
      setUploadNote("");
    }
    event.target.value = "";
  }

  function handleConfirmUpload() {
    if (!pendingFile || !patient) return;
    const latestAppointment = history[0];
    addPrescription({
      id: `prescription-${crypto.randomUUID()}`,
      appointmentId: latestAppointment?.id ?? "",
      patientId: patient.id,
      doctorId: latestAppointment?.doctorId ?? "",
      fileUrl: URL.createObjectURL(pendingFile),
      fileName: pendingFile.name,
      fileType: pendingFile.type,
      notes: uploadNote.trim() || undefined,
      createdAt: new Date().toISOString(),
    });
    setPendingFile(null);
    setUploadNote("");
  }

  function handleCancelUpload() {
    setPendingFile(null);
    setUploadNote("");
  }

  return (
    <>
      {pendingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-base font-bold text-slate-900">Upload prescription</h2>
              <button onClick={handleCancelUpload} className="text-slate-400 hover:text-slate-600">
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <FileText className="size-5 shrink-0 text-accent" />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{pendingFile.name}</div>
                <div className="text-xs text-slate-400">{(pendingFile.size / 1024).toFixed(1)} KB</div>
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Note (optional)</label>
              <Textarea
                rows={3}
                value={uploadNote}
                onChange={(e) => setUploadNote(e.target.value)}
                placeholder="Add a note about this file..."
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={handleCancelUpload}>Cancel</Button>
              <Button onClick={handleConfirmUpload}><Upload className="mr-2 size-4" />Upload</Button>
            </div>
          </div>
        </div>
      )}

    <AdminPageShell
      eyebrow="Patients"
      title="Patient records and follow-up history"
      description="A central workspace for patient identity, visit history, record notes, and attached prescription/report files."
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        className="hidden"
        onChange={handleFileChange}
      />
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
              action={<Button variant="secondary" onClick={() => fileInputRef.current?.click()}><FileText className="mr-2 size-4" />Upload prescription</Button>}
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
    </>
  );
}
