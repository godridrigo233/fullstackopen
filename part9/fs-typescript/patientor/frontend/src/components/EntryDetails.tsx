import { Card, CardContent, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import HealthRatingBar from './HealthRatingBar';
import {
  EntryType,
  type Diagnosis,
  type Entry,
  type HealthCheckEntry,
  type HospitalEntry,
  type OccupationalHealthcareEntry,
} from '../types';

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const assertNever = (entry: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(entry)}`);
};

const diagnosisName = (code: string, diagnoses: Diagnosis[]): string => {
  const diagnosis = diagnoses.find((item) => item.code === code);
  return diagnosis ? `${code} ${diagnosis.name}` : code;
};

const HealthCheckDetails = ({ entry }: { entry: HealthCheckEntry }) => (
  <HealthRatingBar rating={entry.healthCheckRating} showText />
);

const HospitalDetails = ({ entry }: { entry: HospitalEntry }) => (
  <Typography>
    Discharged {entry.discharge.date}: {entry.discharge.criteria}
  </Typography>
);

const OccupationalHealthcareDetails = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) => (
  <>
    <Typography>Employer: {entry.employerName}</Typography>
    {entry.sickLeave && (
      <Typography>
        Sick leave: {entry.sickLeave.startDate} – {entry.sickLeave.endDate}
      </Typography>
    )}
  </>
);

const EntryDetails = ({ entry, diagnoses }: Props) => {
  let details: ReactNode;

  switch (entry.type) {
    case EntryType.HealthCheck:
      details = <HealthCheckDetails entry={entry} />;
      break;
    case EntryType.Hospital:
      details = <HospitalDetails entry={entry} />;
      break;
    case EntryType.OccupationalHealthcare:
      details = <OccupationalHealthcareDetails entry={entry} />;
      break;
    default:
      return assertNever(entry);
  }

  return (
    <Card variant="outlined" sx={{ my: 1 }}>
      <CardContent>
        <Typography variant="subtitle1">
          {entry.date} — {entry.type}
        </Typography>
        <Typography>{entry.description}</Typography>
        {details}
        <Typography>Diagnosed by {entry.specialist}</Typography>
        {entry.diagnosisCodes && (
          <ul>
            {entry.diagnosisCodes.map((code) => (
              <li key={code}>{diagnosisName(code, diagnoses)}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default EntryDetails;
