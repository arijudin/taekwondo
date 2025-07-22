-- Insert default super admin user (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, role) 
VALUES (
  'superadmin@example.com', 
  '$2b$10$rQZ9QmjlhZZvQjpvP5H5/.X5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5',
  'Super', 
  'Admin', 
  'super_admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample users for each role
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
  ('admin@example.com', '$2b$10$rQZ9QmjlhZZvQjpvP5H5/.X5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5', 'John', 'Admin', 'admin'),
  ('operator@example.com', '$2b$10$rQZ9QmjlhZZvQjpvP5H5/.X5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5', 'Jane', 'Operator', 'operator'),
  ('coach@example.com', '$2b$10$rQZ9QmjlhZZvQjpvP5H5/.X5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H5', 'Mike', 'Coach', 'coaching_staff')
ON CONFLICT (email) DO NOTHING;
