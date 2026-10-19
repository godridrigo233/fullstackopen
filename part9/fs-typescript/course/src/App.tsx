import Content from './components/Content';
import Header from './components/Header';
import Total from './components/Total';
import type { CoursePart } from './types';

const courseName = 'Half Stack application development';

const courseParts: CoursePart[] = [
  {
    name: 'Fundamentals',
    exerciseCount: 10,
    description: 'This is an awesome course part',
    kind: 'basic',
  },
  {
    name: 'Using props to pass data',
    exerciseCount: 7,
    groupProjectCount: 3,
    kind: 'group',
  },
  {
    name: 'Basics of type narrowing',
    exerciseCount: 7,
    description: 'How to go from unknown to string',
    kind: 'basic',
  },
  {
    name: 'Deeper type usage',
    exerciseCount: 14,
    description: 'Confusing description',
    backgroundMaterial: 'https://example.com/advanced-types',
    kind: 'background',
  },
  {
    name: 'Backend development',
    exerciseCount: 21,
    description: 'Typing the backend',
    requirements: ['nodejs', 'jest'],
    kind: 'special',
  },
];

const App = () => (
  <main>
    <Header name={courseName} />
    <Content parts={courseParts} />
    <Total parts={courseParts} />
  </main>
);

export default App;
