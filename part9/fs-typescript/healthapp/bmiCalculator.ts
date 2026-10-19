export const calculateBmi = (height: number, weight: number): string => {
  if (!Number.isFinite(height) || !Number.isFinite(weight) || height <= 0 || weight <= 0) {
    throw new Error('Height and weight must be positive finite numbers');
  }

  const bmi = weight / ((height / 100) ** 2);

  if (bmi < 16) return 'Severe thinness';
  if (bmi < 17) return 'Moderate thinness';
  if (bmi < 18.5) return 'Mild thinness';
  if (bmi < 25) return 'Normal range';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obese class I';
  if (bmi < 40) return 'Obese class II';
  return 'Obese class III';
};

if (process.argv[1] === import.meta.filename) {
  const [heightInput, weightInput] = process.argv.slice(2);
  const height = Number(heightInput);
  const weight = Number(weightInput);

  try {
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : 'Invalid BMI input');
    process.exitCode = 1;
  }
}
