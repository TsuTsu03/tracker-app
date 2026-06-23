export type PipelineStage =
  | "New Lead"
  | "Contacted"
  | "Responded"
  | "Appointment Scheduled"
  | "Discovery Meeting"
  | "Proposal Presented"
  | "Under Consideration"
  | "Follow-Up"
  | "Closed Won"
  | "Closed Lost";

export const PIPELINE_STAGES: PipelineStage[] = [
  "New Lead",
  "Contacted",
  "Responded",
  "Appointment Scheduled",
  "Discovery Meeting",
  "Proposal Presented",
  "Under Consideration",
  "Follow-Up",
  "Closed Won",
  "Closed Lost",
];

export type Temperature = "Hot" | "Warm" | "Cold";

export interface Lead {
  id: string;
  fullName: string;
  nickname?: string;
  birthday?: string;
  age?: number;
  gender?: "Male" | "Female";
  phone: string;
  email: string;
  occupation: string;
  company?: string;
  industry?: string;
  civilStatus?: "Single" | "Married" | "Widowed" | "Separated";
  dependents?: number;
  monthlyIncome?: number;
  netWorth?: number;
  location: string;
  socials?: { platform: string; handle: string }[];
  stage: PipelineStage;
  temperature: Temperature;
  aiScore: number;
  scoreReasons: string[];
  potentialPremium: number;
  lastContact: string; // ISO
  createdAt: string; // ISO
  source: string;
  avatarSeed?: string;
}

export interface Client {
  id: string;
  fullName: string;
  nickname?: string;
  age: number;
  phone: string;
  email: string;
  occupation: string;
  location: string;
  civilStatus: string;
  dependents: number;
  relationshipScore: number; // 0-100 health
  lastContact: string;
  clientSince: string;
  policies: Policy[];
  beneficiaries: { name: string; relation: string; share: number }[];
  goals: string[];
  notes: string;
  timeline: TimelineEvent[];
}

export interface Policy {
  id: string;
  product: string;
  type: "Life" | "VUL" | "Health" | "Education" | "Retirement" | "Accident";
  faceAmount: number;
  premium: number;
  frequency: "Monthly" | "Quarterly" | "Annual";
  status: "In Force" | "Lapsed" | "Grace Period" | "Pending";
  nextDue: string;
  startDate: string;
}

export interface TimelineEvent {
  date: string;
  label: string;
  type: "meeting" | "application" | "approval" | "payment" | "claim" | "milestone";
}

export type EventCategory =
  | "Personal"
  | "Meeting"
  | "Follow-up"
  | "Review"
  | "Reminder";

export const EVENT_CATEGORIES: EventCategory[] = [
  "Personal",
  "Meeting",
  "Follow-up",
  "Review",
  "Reminder",
];

/** A personal calendar entry the advisor creates and owns (editable). */
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  startsAt: string; // ISO
  endsAt: string; // ISO
  allDay: boolean;
  category: EventCategory;
}

/** A production goal — a target APE to hit by a deadline (incentive trip, MDRT,
 *  quota). `currentApe` is advisor-editable because credited APE differs from
 *  raw policy APE (double/triple-credit closings). */
export interface Goal {
  id: string;
  title: string;
  targetApe: number;
  currentApe: number;
  deadline: string; // ISO date (YYYY-MM-DD)
  note: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  due: string;
  type: "Follow-up" | "Meeting" | "Review" | "Payment" | "Call";
  relatedTo: string;
  priority: "High" | "Medium" | "Low";
  done: boolean;
}

export interface Advisor {
  id: string;
  name: string;
  role: "Financial Advisor" | "Unit Manager" | "Branch Manager";
  unit: string;
  appointments: number;
  applications: number;
  production: number;
  persistency: number;
  conversion: number;
  avatarSeed: string;
}

export interface ServiceTicket {
  id: string;
  client: string;
  request:
    | "Beneficiary change"
    | "Address update"
    | "Claims assistance"
    | "Policy review"
    | "Fund switch";
  status: "Open" | "In Progress" | "Resolved";
  priority: "High" | "Medium" | "Low";
  created: string;
}

export interface Claim {
  id: string;
  client: string;
  policy: string;
  type: string;
  amount: number;
  status: "Submitted" | "Processing" | "Approved" | "Released";
  filed: string;
}
