CREATE TABLE [IF NOT EXISTS] data (
  ID SERIAL PRIMARY KEY,
  key VARCHAR(6) NOT NULL,
  correct INT NOT NULL,
  started INT NOT NULL
);

INSERT INTO data (key, correct, started)
VALUES  ('abcabc', 123123, 0);