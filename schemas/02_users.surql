DEFINE TABLE users SCHEMAFULL;

DEFINE FIELD id ON TABLE users TYPE record ASSERT $value != NONE;
DEFINE FIELD username ON TABLE users TYPE string ASSERT $value != NONE;
DEFINE FIELD email ON TABLE users TYPE string ASSERT $value != NONE;
DEFINE FIELD password_hash ON TABLE users TYPE string ASSERT $value != NONE;
DEFINE FIELD is_admin ON TABLE users TYPE bool;
DEFINE FIELD created_at ON TABLE users TYPE int DEFAULT ALWAYS time::millis();

-- Make sure ids, emails, and usernames are unique
DEFINE INDEX users_id_index ON TABLE users FIELDS id UNIQUE;
DEFINE INDEX users_email_index ON TABLE users FIELDS email UNIQUE;
DEFINE INDEX users_username_index ON TABLE users FIELDS username UNIQUE;

-- Insert test normal user
INSERT INTO users (username, email, password_hash, is_admin) VALUES ("Norman User", "norman@gmail.com", crypto::bcrypt::generate("12345678"), false);

-- Insert test admin user
INSERT INTO users (username, email, password_hash, is_admin) VALUES ("Addy Admin", "admin@gmail.com", crypto::bcrypt::generate("12345678"), true);
