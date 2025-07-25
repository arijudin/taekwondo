-- Tournament management tables

-- Tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  location VARCHAR(255),
  organizer VARCHAR(255),
  chairman VARCHAR(255),
  referee_chief VARCHAR(255),
  treasurer VARCHAR(255),
  admin_tournament VARCHAR(255),
  registration_fee DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'registration', 'ongoing', 'completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  manager_name VARCHAR(255),
  manager_phone VARCHAR(50),
  manager_email VARCHAR(255),
  registration_status VARCHAR(50) DEFAULT 'pending' CHECK (registration_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Age categories
CREATE TABLE IF NOT EXISTS age_categories (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  min_age INTEGER,
  max_age INTEGER,
  description TEXT
);

-- Tournament classes
CREATE TABLE IF NOT EXISTS tournament_classes (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
  age_category_id INTEGER REFERENCES age_categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'mixed')),
  weight_min DECIMAL(5,2),
  weight_max DECIMAL(5,2),
  class_type VARCHAR(50) CHECK (class_type IN ('individual', 'pair', 'team', 'freestyle_individual', 'freestyle_pair', 'freestyle_team')),
  belt_requirement VARCHAR(100)
);

-- Participants table
CREATE TABLE IF NOT EXISTS participants (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
  tournament_class_id INTEGER REFERENCES tournament_classes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
  weight DECIMAL(5,2),
  belt_level VARCHAR(50),
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  bpjs_number VARCHAR(50),
  participant_type VARCHAR(50) CHECK (participant_type IN ('individual', 'pair', 'team', 'freestyle_individual', 'freestyle_pair', 'freestyle_team')),
  registration_status VARCHAR(50) DEFAULT 'registered' CHECK (registration_status IN ('registered', 'verified', 'disqualified')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches/Brackets table
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
  tournament_class_id INTEGER REFERENCES tournament_classes(id) ON DELETE CASCADE,
  participant1_id INTEGER REFERENCES participants(id) ON DELETE CASCADE,
  participant2_id INTEGER REFERENCES participants(id) ON DELETE SET NULL,
  round_number INTEGER NOT NULL,
  match_number INTEGER NOT NULL,
  scheduled_date DATE,
  scheduled_time TIME,
  court_number INTEGER,
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  winner_id INTEGER REFERENCES participants(id) ON DELETE SET NULL,
  score_p1 INTEGER DEFAULT 0,
  score_p2 INTEGER DEFAULT 0,
  notes TEXT
);

-- Officials table (referees, judges, etc.)
CREATE TABLE IF NOT EXISTS officials (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL, -- referee, judge, timekeeper, etc.
  certification_level VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(255),
  assigned_matches INTEGER[] DEFAULT '{}'
);

-- Tournament results/rankings
CREATE TABLE IF NOT EXISTS tournament_results (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
  tournament_class_id INTEGER REFERENCES tournament_classes(id) ON DELETE CASCADE,
  participant_id INTEGER REFERENCES participants(id) ON DELETE CASCADE,
  position INTEGER NOT NULL, -- 1st, 2nd, 3rd, etc.
  medal_type VARCHAR(20) CHECK (medal_type IN ('gold', 'silver', 'bronze')),
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_teams_tournament ON teams(tournament_id);
CREATE INDEX IF NOT EXISTS idx_participants_tournament ON participants(tournament_id);
CREATE INDEX IF NOT EXISTS idx_participants_team ON participants(team_id);
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_class ON matches(tournament_class_id);
CREATE INDEX IF NOT EXISTS idx_results_tournament ON tournament_results(tournament_id);
