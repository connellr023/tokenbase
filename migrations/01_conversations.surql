DEFINE TABLE conversations SCHEMAFULL;

DEFINE FIELD id ON TABLE conversations TYPE string ASSERT $value != NONE;
DEFINE FIELD user_id ON TABLE conversations TYPE string ASSERT $value != NONE
    AND (SELECT count() FROM users WHERE id = $value) > 0; -- Make sure there is a user with this id
DEFINE FIELD conversation_name ON TABLE conversations TYPE string;
DEFINE FIELD created_at ON TABLE conversations TYPE datetime;
DEFINE FIELD updated_at ON TABLE conversations TYPE datetime;

-- Make sure the id is unique
DEFINE INDEX unique_conversations_id ON conversations FIELDS (id) UNIQUE;

-- Index on user_id to make getting all conversations for a user faster
DEFINE INDEX idx_conversations_user_id ON conversations FIELDS (user_id);