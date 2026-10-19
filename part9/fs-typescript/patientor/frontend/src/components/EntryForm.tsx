import { useState, type FormEvent } from 'react';
import { Alert, Button, MenuItem, TextField } from '@mui/material';
import {
  EntryType,
  HealthCheckRating,
  type Diagnosis,
  type NewEntry,
} from '../types';

interface Props {
  diagnoses: Diagnosis[];
  error?: string;
  onSubmit: (entry: NewEntry) => Promise<void>;
}

const entryTypes = Object.values(EntryType);
const ratings = [
  { value: HealthCheckRating.Healthy, label: 'Healthy' },
  { value: HealthCheckRating.LowRisk, label: 'Low risk' },
  { value: HealthCheckRating.HighRisk, label: 'High risk' },
  { value: HealthCheckRating.CriticalRisk, label: 'Critical risk' },
];

const EntryForm = ({ diagnoses, error, onSubmit }: Props) => {
  const [type, setType] = useState<EntryType>(EntryType.HealthCheck);
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(
    HealthCheckRating.Healthy
  );
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const common = {
      date,
      description,
      specialist,
      diagnosisCodes,
    };

    switch (type) {
      case EntryType.HealthCheck:
        await onSubmit({ ...common, type, healthCheckRating });
        return;
      case EntryType.Hospital:
        await onSubmit({
          ...common,
          type,
          discharge: { date: dischargeDate, criteria: dischargeCriteria },
        });
        return;
      case EntryType.OccupationalHealthcare:
        await onSubmit({
          ...common,
          type,
          employerName,
          ...(sickLeaveStart && sickLeaveEnd
            ? { sickLeave: { startDate: sickLeaveStart, endDate: sickLeaveEnd } }
            : {}),
        });
        return;
      default: {
        const exhaustiveType: never = type;
        throw new Error(`Unhandled entry type: ${exhaustiveType}`);
      }
    }
  };

  const changeType = (value: string) => {
    const nextType = entryTypes.find((entryType) => entryType === value);
    if (nextType) setType(nextType);
  };

  const changeRating = (value: string) => {
    const nextRating = ratings.find((rating) => rating.value.toString() === value);
    if (nextRating) setHealthCheckRating(nextRating.value);
  };

  return (
    <form onSubmit={(event) => void submit(event)}>
      <h3>Add a new entry</h3>
      {error && <Alert severity="error" role="alert">{error}</Alert>}
      <TextField
        select
        fullWidth
        label="Entry type"
        value={type}
        onChange={(event) => changeType(event.target.value)}
        margin="dense"
      >
        {entryTypes.map((entryType) => (
          <MenuItem key={entryType} value={entryType}>{entryType}</MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        required
        type="date"
        label="Date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        margin="dense"
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <TextField
        fullWidth
        required
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        margin="dense"
      />
      <TextField
        fullWidth
        required
        label="Specialist"
        value={specialist}
        onChange={(event) => setSpecialist(event.target.value)}
        margin="dense"
      />
      <TextField
        select
        fullWidth
        SelectProps={{ multiple: true }}
        label="Diagnosis codes"
        value={diagnosisCodes}
        onChange={(event) => {
          const value = event.target.value;
          setDiagnosisCodes(typeof value === 'string' ? value.split(',') : value);
        }}
        margin="dense"
      >
        {diagnoses.map((diagnosis) => (
          <MenuItem key={diagnosis.code} value={diagnosis.code}>
            {diagnosis.code} — {diagnosis.name}
          </MenuItem>
        ))}
      </TextField>

      {type === EntryType.HealthCheck && (
        <TextField
          select
          fullWidth
          label="Health rating"
          value={healthCheckRating}
          onChange={(event) => changeRating(event.target.value)}
          margin="dense"
        >
          {ratings.map((rating) => (
            <MenuItem key={rating.value} value={rating.value}>
              {rating.label}
            </MenuItem>
          ))}
        </TextField>
      )}

      {type === EntryType.Hospital && (
        <>
          <TextField
            fullWidth
            required
            type="date"
            label="Discharge date"
            value={dischargeDate}
            onChange={(event) => setDischargeDate(event.target.value)}
            margin="dense"
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            fullWidth
            required
            label="Discharge criteria"
            value={dischargeCriteria}
            onChange={(event) => setDischargeCriteria(event.target.value)}
            margin="dense"
          />
        </>
      )}

      {type === EntryType.OccupationalHealthcare && (
        <>
          <TextField
            fullWidth
            required
            label="Employer name"
            value={employerName}
            onChange={(event) => setEmployerName(event.target.value)}
            margin="dense"
          />
          <TextField
            fullWidth
            type="date"
            label="Sick leave start"
            value={sickLeaveStart}
            onChange={(event) => setSickLeaveStart(event.target.value)}
            margin="dense"
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            fullWidth
            type="date"
            label="Sick leave end"
            value={sickLeaveEnd}
            onChange={(event) => setSickLeaveEnd(event.target.value)}
            margin="dense"
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </>
      )}
      <Button type="submit" variant="contained" sx={{ mt: 1 }}>Add</Button>
    </form>
  );
};

export default EntryForm;
