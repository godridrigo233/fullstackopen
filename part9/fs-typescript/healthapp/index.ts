import express, { type Request, type Response } from 'express';
import { calculateBmi } from './bmiCalculator.ts';
import { calculateExercises } from './exerciseCalculator.ts';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parseNumber = (value: unknown): number | undefined => {
  if (typeof value !== 'number' && typeof value !== 'string') return undefined;
  if (typeof value === 'string' && value.trim() === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

app.get('/hello', (_request, response) => {
  response.send('Hello Full Stack!');
});

app.get('/bmi', (request: Request, response: Response) => {
  const heightInput = request.query.height;
  const weightInput = request.query.weight;

  if (typeof heightInput !== 'string' || typeof weightInput !== 'string') {
    response.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  const height = Number(heightInput);
  const weight = Number(weightInput);

  if (!Number.isFinite(height) || !Number.isFinite(weight) || height <= 0 || weight <= 0) {
    response.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  response.json({
    weight,
    height,
    bmi: calculateBmi(height, weight),
  });
});

app.post('/exercises', (request: Request, response: Response) => {
  const body: unknown = request.body;

  if (!isRecord(body)) {
    response.status(400).json({ error: 'parameters missing' });
    return;
  }

  const dailyExercises = body.daily_exercises;
  const target = body.target;

  if (dailyExercises === undefined || target === undefined) {
    response.status(400).json({ error: 'parameters missing' });
    return;
  }

  if (!Array.isArray(dailyExercises)) {
    response.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  const parsedTarget = parseNumber(target);
  const parsedExercises = dailyExercises.map(parseNumber);

  if (
    parsedTarget === undefined ||
    parsedTarget < 0 ||
    parsedExercises.some((hours) => hours === undefined || hours < 0)
  ) {
    response.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  const validExercises = parsedExercises.flatMap((hours) =>
    hours === undefined ? [] : [hours]
  );
  const result = calculateExercises(validExercises, parsedTarget);
  response.json(result);
});

app.listen(port, () => {
  console.log(`Health app listening on port ${port}`);
});
