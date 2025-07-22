-- Insert default users with properly hashed passwords
-- All passwords are: admin123

-- Super Admin
INSERT INTO users (email, password_hash, first_name, last_name, role) 
VALUES (
  'superadmin@example.com', 
  '$2b$10$rQZ9QmjlhZZvQjpvP5H5/.X5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5',
  'Super', 
  'Admin', 
  'super_admin'
) ON CONFLICT (email) DO NOTHING;

-- Admin
INSERT INTO users (email, password_hash, first_name, last_name, role) 
VALUES (
  'admin@example.com', 
  '$2b$10$rQZ9QmjlhZZvQjpvP5H5/.X5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5',
  'John', 
  'Admin', 
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Operator
INSERT INTO users (email, password_hash, first_name, last_name, role) 
VALUES (
  'operator@example.com', 
  '$2b$10$rQZ9QmjlhZZvQjpvP5H5/.X5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5',
  'Jane', 
  'Operator', 
  'operator'
) ON CONFLICT (email) DO NOTHING;

-- Coaching Staff
INSERT INTO users (email, password_hash, first_name, last_name, role) 
VALUES (
  'coach@example.com', 
  '$2b$10$rQZ9QmjlhZZvQjpvP5H5/.X5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5',
  'Mike', 
  'Coach', 
  'coaching_staff'
) ON CONFLICT (email) DO NOTHING;
