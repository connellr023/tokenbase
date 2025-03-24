DEFINE TABLE messages SCHEMAFULL;

DEFINE FIELD id ON TABLE messages TYPE string ASSERT $value != NONE;
DEFINE FIELD conversation_id ON TABLE messages TYPE string ASSERT $value != NONE
    AND (SELECT count() FROM conversations WHERE id = $value) > 0; -- Make sure there is a conversation with this id
DEFINE FIELD sender ON TABLE messages TYPE string ASSERT $value IN ["user", "assistant", "system"]; -- likely won't save system messages here but figured I'd leave this just in case
DEFINE FIELD content ON TABLE messages TYPE string;
DEFINE FIELD created_at ON TABLE messages TYPE datetime;

-- Make sure the id is unique
DEFINE INDEX unique_messages_id ON messages FIELDS (id) UNIQUE;
-- Index on conversation_id to make getting all messages for a conversation faster
DEFINE INDEX idx_messages_conversation_id ON messages FIELDS (conversation_id);