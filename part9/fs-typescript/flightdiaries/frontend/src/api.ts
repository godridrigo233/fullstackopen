import type { DiaryEntry, NewDiaryEntry, NonSensitiveDiaryEntry } from './types';

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
};

const getAll = (): Promise<NonSensitiveDiaryEntry[]> => request('/api/diaries');

const create = (entry: NewDiaryEntry): Promise<DiaryEntry> =>
  request('/api/diaries', {
    method: 'POST',
    body: JSON.stringify(entry),
  });

export default { getAll, create };
