-- Canditate auth
CREATE TABLE IF NOT EXISTS candidate_auth(
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(256) NOT NULL,
  phone_number VARCHAR(15),
  email_address VARCHAR(50),
  passport_no VARCHAR(20) NOT NULL,
  password VARCHAR(200),
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

CREATE TABLE IF NOT EXISTS country(
  id SERIAL PRIMARY KEY,
  country_name VARCHAR(20),
  contact_person VARCHAR(50),
  phone_number VARCHAR(20),
  embassy_phone_number VARCHAR(20),
  embassy_address VARCHAR(200)
)

CREATE TABLE IF NOT EXISTS clutser(
  id SERIAL PRIMARY KEY,
  cluster_name VARCHAR(256),
  cluster_code VARCHAR(20),
  country_id INT,
  description VARCHAR(256),
  FOREIGN KEY (country_id) REFERENCES country(id)
)