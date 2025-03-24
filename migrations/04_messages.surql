DEFINE TABLE messages SCHEMAFULL;

DEFINE FIELD id ON TABLE messages TYPE string ASSERT $value != NONE;
DEFINE FIELD conversation_id ON TABLE messages TYPE string ASSERT $value != NONE; -- Make sure there is a conversation with this id
DEFINE FIELD prompt ON TABLE messages TYPE string;
DEFINE FIELD reply ON TABLE messages TYPE string;
DEFINE FIELD created_at ON TABLE messages TYPE datetime;

-- Make sure the id is unique
DEFINE INDEX unique_messages_id ON messages FIELDS id UNIQUE;
-- Index on conversation_id to make getting all messages for a conversation faster
DEFINE INDEX idx_messages_conversation_id ON messages FIELDS conversation_id;
