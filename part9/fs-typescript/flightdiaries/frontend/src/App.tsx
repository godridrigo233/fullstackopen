import { useEffect, useState } from 'react';
import api from './api';
import EntryForm from './components/EntryForm';
import type { NewDiaryEntry, NonSensitiveDiaryEntry } from './types';

const App = () => {
  const [entries, setEntries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const loadEntries = async () => {
      try {
        setEntries(await api.getAll());
      } catch (cause: unknown) {
        setError(cause instanceof Error ? cause.message : 'Could not load diary entries');
      }
    };
    void loadEntries();
  }, []);

  const addEntry = async (entry: NewDiaryEntry): Promise<boolean> => {
    try {
      const created = await api.create(entry);
      const { id, date, weather, visibility } = created;
      setEntries((current) => [...current, { id, date, weather, visibility }]);
      setError(undefined);
      return true;
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : 'Could not add diary entry');
      return false;
    }
  };

  return (
    <main>
      <h1>Flight Diaries</h1>
      {error && <p role="alert">{error}</p>}
      <EntryForm onSubmit={addEntry} />
      <h2>Diary entries</h2>
      {entries.map((entry) => (
        <article key={entry.id}>
          <h3>{entry.date}</h3>
          <p>Weather: {entry.weather}</p>
          <p>Visibility: {entry.visibility}</p>
        </article>
      ))}
    </main>
  );
};

export default App;
