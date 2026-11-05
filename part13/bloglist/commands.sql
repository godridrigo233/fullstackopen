CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL CHECK (url <> ''),
  title TEXT NOT NULL CHECK (title <> ''),
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes)
SELECT 'Dan Abramov', 'https://overreacted.io/on-let-vs-const/', 'On let vs const', 0
WHERE NOT EXISTS (SELECT 1 FROM blogs WHERE title = 'On let vs const');

INSERT INTO blogs (author, url, title, likes)
SELECT 'Laurenz Albe', 'https://www.cybertec-postgresql.com/en/gaps-in-sequences-in-postgresql/', 'Gaps in sequences in PostgreSQL', 0
WHERE NOT EXISTS (SELECT 1 FROM blogs WHERE title = 'Gaps in sequences in PostgreSQL');