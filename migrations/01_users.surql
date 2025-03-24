DEFINE TABLE users SCHEMAFULL;

DEFINE FIELD id ON TABLE users TYPE string ASSERT $value != NONE;
DEFINE FIELD username ON TABLE users TYPE string ASSERT $value != NONE;
DEFINE FIELD email ON TABLE users TYPE string ASSERT $value != NONE;
DEFINE FIELD password_hash ON TABLE users TYPE string ASSERT $value != NONE;
DEFINE FIELD role ON TABLE users TYPE string ASSERT $value IN ["guest", "user", "admin"];
DEFINE FIELD created_at ON TABLE users TYPE datetime;
DEFINE FIELD updated_at ON TABLE users TYPE datetime;

-- Make sure ids, emails, and usernames are unique
DEFINE INDEX unique_users_id ON users FIELDS (id) UNIQUE;
DEFINE INDEX unique_users_email ON users FIELDS (email) UNIQUE;
DEFINE INDEX unique_users_username ON users FIELDS (username) UNIQUE;