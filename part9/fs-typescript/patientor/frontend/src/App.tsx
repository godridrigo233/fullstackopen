import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container, Typography } from '@mui/material';

import { apiBaseUrl } from "./constants";
import type { Diagnosis, NonSensitivePatient } from "./types";

import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import PatientPage from "./components/PatientPage";

const App = () => {
  const [patients, setPatients] = useState<NonSensitivePatient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const loadAppData = async () => {
      try {
        await axios.get<void>(`${apiBaseUrl}/ping`);
        const [patientData, diagnosisData] = await Promise.all([
          patientService.getAll(),
          patientService.getDiagnoses(),
        ]);
        setPatients(patientData);
        setDiagnoses(diagnosisData);
      } catch (cause: unknown) {
        setError(
          axios.isAxiosError(cause) && cause.message
            ? cause.message
            : cause instanceof Error
              ? cause.message
              : "Could not load Patientor data"
        );
      }
    };
    void loadAppData();
  }, []);
  
  return (
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" sx={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider sx={{ marginY: 2 }} />
          {error && <Typography role="alert" color="error">{error}</Typography>}
          <Routes>
            <Route path="/" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
            <Route path="/patients/:id" element={<PatientPage diagnoses={diagnoses} />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
