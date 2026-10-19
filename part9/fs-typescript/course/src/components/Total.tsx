import type { CoursePart } from '../types';

interface Props {
  parts: CoursePart[];
}

const Total = ({ parts }: Props) => (
  <p>Number of exercises {parts.reduce((sum, part) => sum + part.exerciseCount, 0)}</p>
);

export default Total;
