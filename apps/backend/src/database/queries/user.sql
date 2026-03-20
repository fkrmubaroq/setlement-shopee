-- Common user queries

-- Find user by ID
-- SELECT id, name, email, created_at, updated_at FROM users WHERE id = ? LIMIT 1;

-- Find user by email
-- SELECT * FROM users WHERE email = ? LIMIT 1;

-- Create user
-- INSERT INTO users (name, email, password) VALUES (?, ?, ?);

-- Update user profile
-- UPDATE users SET name = ?, phone = ?, avatar = ?, updated_at = NOW() WHERE id = ?;
