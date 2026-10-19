import Part from './Part';
import type { CoursePart } from '../types';

interface Props {
  parts: CoursePart[];
}

const Content = ({ parts }: Props) => (
  <section>
    {parts.map((part) => (
      <Part key={part.name} part={part} />
    ))}
  </section>
);

export default Content;
