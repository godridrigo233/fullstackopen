import type { CoursePart } from '../types';

interface Props {
  part: CoursePart;
}

const assertNever = (part: never): never => {
  throw new Error(`Unhandled course part: ${JSON.stringify(part)}`);
};

const Part = ({ part }: Props) => {
  let details: string;

  switch (part.kind) {
    case 'basic':
      details = part.description;
      break;
    case 'group':
      details = `Project exercises: ${part.groupProjectCount}`;
      break;
    case 'background':
      details = `${part.description} (${part.backgroundMaterial})`;
      break;
    case 'special':
      details = `${part.description} (Requirements: ${part.requirements.join(', ')})`;
      break;
    default:
      return assertNever(part);
  }

  return (
    <article>
      <h2>{part.name} ({part.exerciseCount} exercises)</h2>
      <p>{details}</p>
    </article>
  );
};

export default Part;
