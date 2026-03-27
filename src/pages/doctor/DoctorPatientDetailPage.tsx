import { ArrowLeft, ClipboardList, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useClinic } from "../../context/ClinicContext";
import type { DoctorPrescription, DoctorPrescriptionItem } from "../../types";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import { formatDate, formatTime } from "../../utils";
import { StatusPill } from "../admin/shared";

const FREQUENCY_OPTIONS = [
  "Once daily",
  "Twice daily",
  "Three times daily",
  "Four times daily",
  "Every 6 hours",
  "Every 8 hours",
  "Every 12 hours",
  "As needed (PRN)",
  "With meals",
  "At bedtime",
];

function blankItem(): DoctorPrescriptionItem {
  return { medication: "", dosage: "", frequency: "Once daily", duration: "", instructions: "" };
}

export function DoctorPatientDetailPage() {
  const { id: patientId } = useParams<{ id: string }>();
  const { doctorId } = useAuth();
  const { patients, appointments, services, doctorPrescriptions, addDoctorPrescription, savePatientNote } = useClinic();

  const patient = patients.find((p) => p.id === patientId);
  const myAppts = appointments
    .filter((a) => a.patientId === patientId && a.doctorId === doctorId)
    .sort((a, b) => b.date.localeCompare(a.date));

  const myPrescriptions = doctorPrescriptions
    .filter((rx) => rx.patientId === patientId && rx.doctorId === doctorId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  // Prescription form state
  const [showRxForm, setShowRxForm] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [items, setItems] = useState<DoctorPrescriptionItem[]>([blankItem()]);
  const [rxNotes, setRxNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Notes state
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(patient?.notes ?? "");

  if (!patient) {
    return (
      <div className="space-y-5">
        <Link to="/doctor/patients" className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-800">
          <ArrowLeft className="size-4" /> Back to patients
        </Link>
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center">
          <div className="text-sm font-bold text-slate-700">Patient not found</div>
        </div>
      </div>
    );
  }

  function addItem() {
    setItems((prev) => [...prev, blankItem()]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof DoctorPrescriptionItem, value: string) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  function resetForm() {
    setDiagnosis("");
    setItems([blankItem()]);
    setRxNotes("");
    setShowRxForm(false);
  }

  function handleSubmitPrescription() {
    if (!diagnosis.trim() || items.some((item) => !item.medication.trim() || !item.dosage.trim())) return;
    setSubmitting(true);
    const rx: DoctorPrescription = {
      id: `dp-${crypto.randomUUID()}`,
      patientId: patient.id,
      doctorId: doctorId ?? "",
      clinicId: patient.clinicId,
      diagnosis: diagnosis.trim(),
      items: items.map((item) => ({
        ...item,
        instructions: item.instructions?.trim() || undefined,
      })),
      notes: rxNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    addDoctorPrescription(rx);
    resetForm();
    setSubmitting(false);
  }

  function handleSaveNotes() {
    savePatientNote(patient.id, notes);
    setEditingNotes(false);
  }

  return (
    <div className="space-y-5">
      {/* Back + header */}
      <div>
        <Link to="/doctor/patients" className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-800">
          <ArrowLeft className="size-4" /> Back to patients
        </Link>
        <section className="mt-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-600">Patient Record</div>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-950">{patient.name}</h1>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
            <span>{patient.phone}</span>
            {patient.email && <span>{patient.email}</span>}
            {patient.gender && <span>{patient.gender}</span>}
            {patient.dateOfBirth && <span>DOB {patient.dateOfBirth}</span>}
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        {/* Left column */}
        <div className="space-y-5">
          {/* Visit history */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4">
              <h2 className="text-base font-bold text-slate-950">Visit History</h2>
              <p className="mt-0.5 text-xs text-slate-500">All appointments with you</p>
            </div>
            <div className="px-5 py-4">
              {myAppts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
                  <div className="text-sm font-bold text-slate-700">No visits yet</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {myAppts.map((appt) => {
                    const service = services.find((s) => s.id === appt.serviceId);
                    return (
                      <div key={appt.id} className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">{formatDate(appt.date)}</div>
                            <div className="mt-0.5 text-xs text-slate-500">
                              {formatTime(appt.startTime)} – {formatTime(appt.endTime)}
                              {service ? ` · ${service.name}` : ""}
                            </div>
                            {appt.notes && (
                              <div className="mt-1 text-xs text-slate-400 italic">{appt.notes}</div>
                            )}
                          </div>
                          <StatusPill status={appt.status} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Clinical notes */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-slate-950">Clinical Notes</h2>
                <p className="mt-0.5 text-xs text-slate-500">Internal notes for this patient</p>
              </div>
              {!editingNotes && (
                <button
                  onClick={() => { setNotes(patient.notes ?? ""); setEditingNotes(true); }}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-800"
                >
                  Edit
                </button>
              )}
            </div>
            <div className="px-5 py-4">
              {editingNotes ? (
                <div className="space-y-3">
                  <Textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add clinical notes…"
                  />
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={handleSaveNotes}>Save notes</Button>
                    <Button variant="secondary" onClick={() => setEditingNotes(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-600 whitespace-pre-wrap">
                  {patient.notes || <span className="italic text-slate-400">No clinical notes added.</span>}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right column — prescriptions */}
        <div className="space-y-5">
          {/* Write prescription */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-slate-950">Write Prescription</h2>
                <p className="mt-0.5 text-xs text-slate-500">Issue a new prescription</p>
              </div>
              {!showRxForm && (
                <Button className="py-2 text-xs" onClick={() => setShowRxForm(true)}>
                  <Plus className="mr-1 size-3.5" /> New
                </Button>
              )}
            </div>

            {showRxForm ? (
              <div className="px-5 py-4 space-y-4">
                {/* Diagnosis */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Diagnosis *</label>
                  <Input
                    placeholder="e.g. Hypertension – Stage 1"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />
                </div>

                {/* Medication items */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Medications *</label>
                    <button onClick={addItem} className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-800">
                      <Plus className="size-3" /> Add medication
                    </button>
                  </div>
                  <div className="space-y-3">
                    {items.map((item, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-500">Medication {idx + 1}</span>
                          {items.length > 1 && (
                            <button onClick={() => removeItem(idx)} className="text-slate-400 hover:text-red-500">
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Name *</label>
                            <Input
                              placeholder="e.g. Amoxicillin"
                              value={item.medication}
                              onChange={(e) => updateItem(idx, "medication", e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Dosage *</label>
                            <Input
                              placeholder="e.g. 500 mg"
                              value={item.dosage}
                              onChange={(e) => updateItem(idx, "dosage", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Frequency</label>
                            <select
                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                              value={item.frequency}
                              onChange={(e) => updateItem(idx, "frequency", e.target.value)}
                            >
                              {FREQUENCY_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Duration</label>
                            <Input
                              placeholder="e.g. 7 days"
                              value={item.duration}
                              onChange={(e) => updateItem(idx, "duration", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Instructions</label>
                          <Input
                            placeholder="e.g. Take with food"
                            value={item.instructions ?? ""}
                            onChange={(e) => updateItem(idx, "instructions", e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Additional notes</label>
                  <Textarea
                    rows={3}
                    placeholder="Follow-up instructions, lifestyle advice…"
                    value={rxNotes}
                    onChange={(e) => setRxNotes(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    disabled={submitting || !diagnosis.trim() || items.some((i) => !i.medication.trim() || !i.dosage.trim())}
                    onClick={handleSubmitPrescription}
                  >
                    {submitting ? "Saving…" : "Issue Prescription"}
                  </Button>
                  <Button variant="secondary" onClick={resetForm}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="px-5 py-4">
                <p className="text-sm text-slate-400">Click "New" to write a prescription for this patient.</p>
              </div>
            )}
          </div>

          {/* Past prescriptions */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4">
              <h2 className="text-base font-bold text-slate-950">Past Prescriptions</h2>
              <p className="mt-0.5 text-xs text-slate-500">Prescriptions you've issued</p>
            </div>
            <div className="px-5 py-4">
              {myPrescriptions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-center">
                  <div className="text-sm font-bold text-slate-700">No prescriptions yet</div>
                  <div className="mt-1 text-xs text-slate-400">Use the form above to issue one.</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {myPrescriptions.map((rx) => (
                    <div key={rx.id} className="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-4">
                      <div className="flex items-start gap-2">
                        <ClipboardList className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900">{rx.diagnosis}</div>
                          <div className="mt-0.5 text-[11px] text-slate-400">{new Date(rx.createdAt).toLocaleString()}</div>
                          <div className="mt-2.5 space-y-1.5">
                            {rx.items.map((item, idx) => (
                              <div key={idx} className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-xs">
                                <div className="font-bold text-slate-800">{item.medication} — {item.dosage}</div>
                                <div className="mt-0.5 text-slate-500">
                                  {item.frequency} · {item.duration}
                                  {item.instructions ? ` · ${item.instructions}` : ""}
                                </div>
                              </div>
                            ))}
                          </div>
                          {rx.notes && (
                            <div className="mt-2 text-xs text-slate-500 italic">{rx.notes}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
