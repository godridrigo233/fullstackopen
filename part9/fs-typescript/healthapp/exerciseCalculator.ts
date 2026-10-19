export interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  dailyExercises: number[],
  target: number
): ExerciseResult => {
  if (!Number.isFinite(target) || target < 0) {
    throw new Error('Target must be a non-negative finite number');
  }
  if (!dailyExercises.every((hours) => Number.isFinite(hours) && hours >= 0)) {
    throw new Error('Exercise hours must be non-negative finite numbers');
  }

  const periodLength = dailyExercises.length;
  const trainingDays = dailyExercises.filter((hours) => hours > 0).length;
  const average = periodLength === 0
    ? 0
    : dailyExercises.reduce((sum, hours) => sum + hours, 0) / periodLength;
  const success = average >= target;
  const rating = success ? 3 : average >= target / 2 ? 2 : 1;
  const ratingDescription = {
    1: 'bad',
    2: 'not too bad but could be better',
    3: 'excellent',
  }[rating];

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

if (process.argv[1] === import.meta.filename) {
  const [targetInput, ...exerciseInputs] = process.argv.slice(2);
  const target = Number(targetInput);
  const exercises = exerciseInputs.map(Number);

  try {
    if (targetInput === undefined || exerciseInputs.length === 0) {
      throw new Error('Provide a target followed by the daily exercise hours');
    }
    console.log(calculateExercises(exercises, target));
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : 'Invalid exercise input');
    process.exitCode = 1;
  }
}
