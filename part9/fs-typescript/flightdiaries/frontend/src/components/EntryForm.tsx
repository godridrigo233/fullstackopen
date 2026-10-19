import { useState, type FormEvent } from 'react';
import {
  Visibility,
  Weather,
  type NewDiaryEntry,
  type Visibility as VisibilityValue,
  type Weather as WeatherValue,
} from '../types';

interface Props {
  onSubmit: (entry: NewDiaryEntry) => Promise<boolean>;
}

const weatherOptions = Object.values(Weather);
const visibilityOptions = Object.values(Visibility);

const EntryForm = ({ onSubmit }: Props) => {
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<WeatherValue>(Weather.Sunny);
  const [visibility, setVisibility] = useState<VisibilityValue>(Visibility.Good);
  const [comment, setComment] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const created = await onSubmit({ date, weather, visibility, comment });
    if (created) setComment('');
  };

  return (
    <form onSubmit={(event) => void handleSubmit(event)}>
      <h2>Add a diary entry</h2>
      <label>
        Date
        <input
          type="date"
          required
          value={date}
          onChange={(event) => setDate(event.currentTarget.value)}
        />
      </label>
      <fieldset>
        <legend>Weather</legend>
        {weatherOptions.map((option) => (
          <label key={option}>
            <input
              type="radio"
              name="weather"
              value={option}
              checked={weather === option}
              onChange={() => setWeather(option)}
            />
            {option}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Visibility</legend>
        {visibilityOptions.map((option) => (
          <label key={option}>
            <input
              type="radio"
              name="visibility"
              value={option}
              checked={visibility === option}
              onChange={() => setVisibility(option)}
            />
            {option}
          </label>
        ))}
      </fieldset>
      <label>
        Comment
        <input
          value={comment}
          onChange={(event) => setComment(event.currentTarget.value)}
        />
      </label>
      <button type="submit">Add</button>
    </form>
  );
};

export default EntryForm;
