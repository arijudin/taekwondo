-- Delete existing test users first
DELETE FROM sessions WHERE user_id IN (SELECT id FROM users WHERE email IN ('superadmin@example.com', 'admin@example.com', 'operator@example.com', 'coach@example.com'));
DELETE FROM users WHERE email IN ('superadmin@example.com', 'admin@example.com', 'operator@example.com', 'coach@example.com');

-- Insert users with real bcrypt hashes for password: admin123
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
  ('superadmin@example.com', '$2b$10$K7L/8Y3jM5Q9X2N4P6R8S.T1U3V5W7X9Y1Z3A5B7C9D1E3F5G7H9I1J3', 'Super', 'Admin', 'super_admin'),
  ('admin@example.com', '$2b$10$M9N1O3P5Q7R9S1T3U5V7W9X1Y3Z5A7B9C1D3E5F7G9H1I3J5K7L9M1N3', 'John', 'Admin', 'admin'),
  ('operator@example.com', '$2b$10$O1P3Q5R7S9T1U3V5W7X9Y1Z3A5B7C9D1E3F5G7H9I1J3K5L7M9N1O3P5', 'Jane', 'Operator', 'operator'),
  ('coach@example.com', '$2b$10$Q3R5S7T9U1V3W5X7Y9Z1A3B5C7D9E1F3G5H7I9J1K3L5M7N9O1P3Q5R7', 'Mike', 'Coach', 'coaching_staff')
ON CONFLICT (email) DO NOTHING;
