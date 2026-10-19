import { useEffect, useState } from 'react';
import { Alert, Button, CircularProgress, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import EntryDetails from './EntryDetails';
import EntryForm from './EntryForm';
import patientService from '../services/patients';
import type { Diagnosis, NewEntry, Patient } from '../types';
import axios from 'axios';

interface Props {
  diagnoses: Diagnosis[];
}

const errorMessage = (cause: unknown): string => {
  if (axios.isAxiosError(cause)) {
    const responseData: unknown = cause.response?.data;
    if (typeof responseData === 'string') return responseData;
    if (
      typeof responseData === 'object' &&
      responseData !== null &&
      'error' in responseData
    ) {
      return JSON.stringify(responseData.error);
    }
    return cause.message;
  }
  return cause instanceof Error ? cause.message : 'An unexpected error occurred';
};

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient>();
  const [loadingError, setLoadingError] = useState<string>();
  const [entryError, setEntryError] = useState<string>();
  const [entryFormOpen, setEntryFormOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadPatient = async () => {
      try {
        setPatient(await patientService.getById(id));
        setLoadingError(undefined);
      } catch (cause: unknown) {
        setLoadingError(errorMessage(cause));
      }
    };
    void loadPatient();
  }, [id]);

  const addEntry = async (entry: NewEntry) => {
    if (!id || !patient) return;
    try {
      const addedEntry = await patientService.createEntry(id, entry);
      setPatient({ ...patient, entries: [...patient.entries, addedEntry] });
      setEntryError(undefined);
      setEntryFormOpen(false);
    } catch (cause: unknown) {
      setEntryError(errorMessage(cause));
    }
  };

  if (!id) return <Alert severity="error">Patient id is missing</Alert>;
  if (loadingError) return <Alert severity="error">{loadingError}</Alert>;
  if (!patient) return <CircularProgress aria-label="Loading patient" />;

  return (
    <section>
      <Typography variant="h4">{patient.name}</Typography>
      <Typography>SSN: {patient.ssn}</Typography>
      <Typography>Date of birth: {patient.dateOfBirth}</Typography>
      <Typography>Occupation: {patient.occupation}</Typography>
      <Typography>Gender: {patient.gender}</Typography>
      {!entryFormOpen ? (
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => setEntryFormOpen(true)}
        >
          Add New Entry
        </Button>
      ) : (
        <>
          <EntryForm diagnoses={diagnoses} error={entryError} onSubmit={addEntry} />
          <Button onClick={() => setEntryFormOpen(false)}>Cancel</Button>
        </>
      )}
      <Typography variant="h5" sx={{ mt: 3 }}>Entries</Typography>
      {patient.entries.map((entry) => (
        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
    </section>
  );
};

export default PatientPage;
