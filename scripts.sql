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
  embassy_address VARCHAR(200),
  created_date TIMESTAMPTZ,
  image VARCHAR(255)
)

CREATE TABLE IF NOT EXISTS clutser(
  id SERIAL PRIMARY KEY,
  cluster_name VARCHAR(256),
  cluster_code VARCHAR(20),
  country_id INT,
  description VARCHAR(256),
  FOREIGN KEY (country_id) REFERENCES country(id)
)

CREATE TABLE IF NOT EXISTS notification(
  id SERIAL PRIMARY KEY,
  cand_id INT,
  title VARCHAR(50),
  description VARCHAR(256),
  FOREIGN KEY (cand_id) REFERENCES candidate_auth(id)
)

CREATE TABLE IF NOT EXISTS user_country (
  id SERIAL PRIMARY KEY,
  country_id INT,
  cand_id INT,
  FOREIGN KEY (country_id) REFERENCES country(id)
  FOREIGN KEY (cand_id) REFERENCES candidate_auth(id)
)

CREATE TABLE IF NOT EXISTS exam_question (
  id SERIAL PRIMARY KEY,
  question_text VARCHAR(255),
  media_file VARCHAR(255),
  cluster_id INT,
  FOREIGN KEY (cluster_id) REFERENCES cluster(id)
)

CREATE TABLE IF NOT EXISTS exam_question_country (
  id SERIAL PRIMARY KEY,
  country_name VARCHAR(50),
  question_id INT,
  FOREIGN KEY (question_id) REFERENCES exam_question(id)
)

CREATE TABLE IF NOT EXISTS exam_answer (
  id SERIAL PRIMARY KEY,
  question_id INT,
  answerText VARCHAR(255),
  isCorrect BOOLEAN DEFAULT false,
  FOREIGN KEY (question_id) REFERENCES exam_question(id)
)

--   id SERIAL PRIMARY KEY,
--   name_english VARCHAR(256) NOT NULL,
--   name_nepali VARCHAR(15),
--   email_address VARCHAR(50),
--   passport_no VARCHAR(20) NOT NULL,
--   password VARCHAR(200),
--   status VARCHAR(10)
-- );
CREATE TABLE IF NOT EXISTS transaction_log (
  id SERIAL PRIMARY KEY,
  cand_id INT,
  transaction_code VARCHAR(50),
  total_amount VARCHAR(50),
  transaction_uuid VARCHAR(55),
  product_code VARCHAR(50),
  status VARCHAR(50),
  created_date TIMESTAMPTZ,
  FOREIGN KEY (cand_id) REFERENCES candidate_auth(id)
)

CREATE TABLE IF NOT EXISTS test_examination (
  id SERIAL PRIMARY KEY,
  cand_id INT,
  test_name VARCHAR(255),
  exam_date TIMESTAMPTZ,
  time_taken VARCHAR(20),
  test_status VARCHAR(55),
  total_amount INT,
  FOREIGN KEY (cand_id) REFERENCES candidate_auth(id)
)
