export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export const Gender = {
  Male: "male",
  Female: "female",
  Other: "other",
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export const EntryType = {
  Hospital: "Hospital",
  OccupationalHealthcare: "OccupationalHealthcare",
  HealthCheck: "HealthCheck",
} as const;

export type EntryType = typeof EntryType[keyof typeof EntryType];

export const HealthCheckRating = {
  Healthy: 0,
  LowRisk: 1,
  HighRisk: 2,
  CriticalRisk: 3,
} as const;

export type HealthCheckRating = typeof HealthCheckRating[keyof typeof HealthCheckRating];

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: string[];
}

export interface HospitalEntry extends BaseEntry {
  type: typeof EntryType.Hospital;
  discharge: {
    date: string;
    criteria: string;
  };
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: typeof EntryType.OccupationalHealthcare;
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

export interface HealthCheckEntry extends BaseEntry {
  type: typeof EntryType.HealthCheck;
  healthCheckRating: HealthCheckRating;
}

export type Entry = HospitalEntry | OccupationalHealthcareEntry | HealthCheckEntry;
export type NewEntry =
  | Omit<HospitalEntry, "id">
  | Omit<OccupationalHealthcareEntry, "id">
  | Omit<HealthCheckEntry, "id">;

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  dateOfBirth: string;
  ssn: string;
  entries: Entry[];
}

export type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;
export type PatientFormValues = Omit<Patient, "id" | "entries">;