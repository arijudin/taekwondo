-- Tournament days table
CREATE TABLE IF NOT EXISTS tournament_days (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  date DATE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIME NOT NULL DEFAULT '08:00:00',
  end_time TIME NOT NULL DEFAULT '18:00:00',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tournament_id, day_number),
  UNIQUE(tournament_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tournament_days_tournament ON tournament_days(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_days_date ON tournament_days(date);
CREATE INDEX IF NOT EXISTS idx_tournament_days_active ON tournament_days(is_active);

-- Insert some sample data
INSERT INTO tournament_days (tournament_id, day_number, date, name, description, start_time, end_time) VALUES
(1, 1, '2024-03-15', 'Opening Day', 'Tournament opening ceremony and first matches', '08:00:00', '18:00:00'),
(1, 2, '2024-03-16', 'Competition Day 1', 'Main competition rounds', '08:00:00', '20:00:00'),
(1, 3, '2024-03-17', 'Finals Day', 'Semi-finals and finals', '09:00:00', '17:00:00')
ON CONFLICT (tournament_id, day_number) DO NOTHING;
