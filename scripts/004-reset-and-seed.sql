-- Clean slate: Remove all existing data
TRUNCATE TABLE sessions CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- Create test users with properly generated bcrypt hashes
-- Password for all accounts: admin123

INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) VALUES
('superadmin@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Super', 'Admin', 'super_admin', true),
('admin@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Admin', 'admin', true),
('operator@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane', 'Operator', 'operator', true),
('coach@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mike', 'Coach', 'coaching_staff', true);

-- Verify the data
SELECT email, first_name, last_name, role, is_active, created_at FROM users ORDER BY role, email;
