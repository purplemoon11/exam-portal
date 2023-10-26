-- Canditate auth
CREATE TABLE IF NOT EXISTS candidate_auth(
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(256) NOT NULL,
  phone_number VARCHAR(15),
  email_address VARCHAR(50),
  passport_no VARCHAR(20) NOT NULL,
  password VARCHAR(50),
  status VARCHAR(10)
);

-- Otp
CREATE TABLE IF NOT EXISTS otp_auth(
 id SERIAL PRIMARY KEY,
 cand_id INT,
 otp VARCHAR(10),
 created_date TIMESTAMPTZ,
 valid_upto TIMESTAMPTZ,
 FOREIGN KEY (cand_id) REFERENCES candidate_auth(id)	
);