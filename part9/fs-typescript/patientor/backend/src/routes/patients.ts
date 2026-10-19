import { Router } from 'express';
import { z } from 'zod';
import patientService from '../services/patientService.ts';
import { EntryType, Gender, HealthCheckRating } from '../types.ts';

const patientRouter = Router();

const newPatientSchema = z.object({
  name: z.string().trim().min(1),
  dateOfBirth: z.iso.date(),
  ssn: z.string().trim().min(1),
  gender: z.enum([Gender.Male, Gender.Female, Gender.Other]),
  occupation: z.string().trim().min(1),
});

const baseEntrySchema = z.object({
  description: z.string().trim().min(1),
  date: z.iso.date(),
  specialist: z.string().trim().min(1),
  diagnosisCodes: z.array(z.string()).optional(),
});

const healthCheckEntrySchema = baseEntrySchema.extend({
  type: z.literal(EntryType.HealthCheck),
  healthCheckRating: z.union([
    z.literal(HealthCheckRating.Healthy),
    z.literal(HealthCheckRating.LowRisk),
    z.literal(HealthCheckRating.HighRisk),
    z.literal(HealthCheckRating.CriticalRisk),
  ]),
});

const hospitalEntrySchema = baseEntrySchema.extend({
  type: z.literal(EntryType.Hospital),
  discharge: z.object({
    date: z.iso.date(),
    criteria: z.string().trim().min(1),
  }),
});

const occupationalHealthcareEntrySchema = baseEntrySchema.extend({
  type: z.literal(EntryType.OccupationalHealthcare),
  employerName: z.string().trim().min(1),
  sickLeave: z.object({
    startDate: z.iso.date(),
    endDate: z.iso.date(),
  }).optional(),
});

const newEntrySchema = z.discriminatedUnion('type', [
  healthCheckEntrySchema,
  hospitalEntrySchema,
  occupationalHealthcareEntrySchema,
]);

patientRouter.get('/', (_request, response) => {
  response.json(patientService.getPatients());
});

patientRouter.get('/:id', (request, response) => {
  const patient = patientService.getPatient(request.params.id);
  if (!patient) {
    response.status(404).json({ error: 'Patient not found' });
    return;
  }
  response.json(patient);
});

patientRouter.post('/', (request, response) => {
  const parsed = newPatientSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.issues });
    return;
  }
  response.json(patientService.addPatient(parsed.data));
});

patientRouter.post('/:id/entries', (request, response) => {
  const parsed = newEntrySchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.issues });
    return;
  }
  const addedEntry = patientService.addEntry(request.params.id, parsed.data);
  if (!addedEntry) {
    response.status(404).json({ error: 'Patient not found' });
    return;
  }
  response.json(addedEntry);
});

export default patientRouter;
