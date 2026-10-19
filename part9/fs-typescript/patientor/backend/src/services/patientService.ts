import seedPatients from '../../data/patients.ts';
import { randomUUID } from 'node:crypto';
import type { Entry, NewEntry, NewPatient, NonSensitivePatient, Patient } from '../types.ts';

const initialEntries: Entry[] = [
  {
    id: 'hospital-entry-john-mcclane',
    type: 'Hospital',
    date: '2019-01-01',
    description: 'Thumb injury treatment',
    specialist: 'MD House',
    diagnosisCodes: ['S62.5'],
    discharge: {
      date: '2019-01-01',
      criteria: 'Thumb has healed',
    },
  },
];

const patients: Patient[] = seedPatients.map((patient) => ({
  ...patient,
  entries: patient.name === 'John McClane' ? [...initialEntries] : [],
}));

const getPatients = (): NonSensitivePatient[] =>
  patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));

const getPatient = (id: string): Patient | undefined =>
  patients.find((patient) => patient.id === id);

const addPatient = (patient: NewPatient): Patient => {
  const addedPatient: Patient = {
    ...patient,
    id: randomUUID(),
    entries: [],
  };
  patients.push(addedPatient);
  return addedPatient;
};

const addEntry = (patientId: string, entry: NewEntry): Entry | undefined => {
  const patient = getPatient(patientId);
  if (!patient) return undefined;
  const addedEntry: Entry = { ...entry, id: randomUUID() };
  patient.entries.push(addedEntry);
  return addedEntry;
};

export default {
  getPatients,
  getPatient,
  addPatient,
  addEntry,
};
