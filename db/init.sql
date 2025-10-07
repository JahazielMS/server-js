CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0
);

-- admin / adminpass
INSERT INTO users (username, password, role)
VALUES ('admin', '$2b$12$xrgyFEN3B3qXaG4b/hm3SeAFXfAxhk.zmH9X4meyDMdarRr71ab96', 'admin')
ON CONFLICT DO NOTHING;
