import { clinic } from "./clinic";

export const TIMES = {
  morning: { chip: "Morning · 10–1", label: "Morning (10 AM – 1 PM)" },
  afternoon: { chip: "Afternoon · 1–5", label: "Afternoon (1 – 5 PM)" },
  evening: { chip: "Evening · 5–9", label: "Evening (5 – 9 PM)" },
} as const;
export type TimeKey = keyof typeof TIMES;
export type DayKey = "today" | "tomorrow" | "other";

export type BookingInput = {
  name: string;
  phone: string;
  treatment: string;
  day: DayKey | "";
  date: string; // yyyy-mm-dd, only for day === "other"
  time: TimeKey | "";
  note: string;
};

export type BookingErrors = Partial<Record<"name" | "phone" | "day" | "time", boolean>>;

/** Strip a +91 / leading 0 so we get the bare 10-digit mobile number. */
export function normalisePhone(raw: string): string {
  let phone = raw.replace(/\D/g, "");
  if (phone.length === 12 && phone.startsWith("91")) phone = phone.slice(2);
  if (phone.length === 11 && phone.startsWith("0")) phone = phone.slice(1);
  return phone;
}

export function validate(f: BookingInput): BookingErrors {
  const e: BookingErrors = {};
  if (!f.name.trim()) e.name = true;
  if (normalisePhone(f.phone).length !== 10) e.phone = true;
  if (!f.day || (f.day === "other" && !f.date)) e.day = true;
  if (!f.time) e.time = true;
  return e;
}

export function todayISO(now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Build the pre-filled WhatsApp URL and the on-screen summary. Assumes `validate` passed. */
export function buildBooking(f: BookingInput, now = new Date()) {
  const fmt = (d: Date) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  let day: string;
  if (f.day === "today") day = "Today, " + fmt(now);
  else if (f.day === "tomorrow") day = "Tomorrow, " + fmt(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));
  else {
    const [y, m, d] = f.date.split("-").map(Number);
    day = fmt(new Date(y, m - 1, d));
  }
  const time = TIMES[f.time as TimeKey].label;
  const treatment = f.treatment || "Not sure yet / check-up";
  const lines = [
    `Hello ${clinic.name}, I would like to book an appointment.`,
    "",
    "Name: " + f.name.trim(),
    "Phone: " + normalisePhone(f.phone),
    "For: " + treatment,
    "Preferred day: " + day,
    "Preferred time: " + time,
  ];
  if (f.note.trim()) lines.push("Note: " + f.note.trim());
  return {
    url: `https://wa.me/${clinic.whatsapp.number}?text=${encodeURIComponent(lines.join("\n"))}`,
    summary: [treatment, day, time].join(" · "),
  };
}
