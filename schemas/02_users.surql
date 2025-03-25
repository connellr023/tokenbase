DEFINE TABLE users SCHEMAFULL;

LET $latest_user_id = SELECT id FROM users ORDER BY id DESC LIMIT 1;

DEFINE FIELD id ON TABLE users TYPE int VALUE $latest_user_id + 1;
DEFINE FIELD username ON TABLE users TYPE string ASSERT $value != NONE;
DEFINE FIELD email ON TABLE users TYPE string ASSERT $value != NONE;
DEFINE FIELD password_hash ON TABLE users TYPE string ASSERT $value != NONE;
DEFINE FIELD is_admin ON TABLE users TYPE bool;
DEFINE FIELD created_at ON TABLE users TYPE datetime;

-- Make sure ids, emails, and usernames are unique
DEFINE INDEX users_id_index ON TABLE users FIELDS id UNIQUE;
DEFINE INDEX users_email_index ON TABLE users FIELDS email UNIQUE;
DEFINE INDEX users_username_index ON TABLE users FIELDS username UNIQUE;
