import express from 'express';
import diagnosisRouter from './routes/diagnoses.ts';
import patientRouter from './routes/patients.ts';

const app = express();
const port = Number(process.env.PORT) || 3001;
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

app.use((request, response, next) => {
  const origin = request.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    response.header('Access-Control-Allow-Origin', origin);
  }
  response.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.header('Access-Control-Allow-Headers', 'Content-Type');
  if (request.method === 'OPTIONS') {
    response.sendStatus(204);
    return;
  }
  next();
});
app.use(express.json());

app.get('/api/ping', (_request, response) => {
  response.send('pong');
});

app.use('/api/diagnoses', diagnosisRouter);
app.use('/api/patients', patientRouter);

app.listen(port, () => {
  console.log(`Patientor backend listening on port ${port}`);
});
