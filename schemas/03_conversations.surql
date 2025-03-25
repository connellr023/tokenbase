DEFINE TABLE conversations SCHEMAFULL;

LET $latest_conversation_id = SELECT id FROM conversations ORDER BY id DESC LIMIT 1;

DEFINE FIELD id ON TABLE conversations TYPE int VALUE $latest_conversation_id + 1;
DEFINE FIELD name ON TABLE conversations TYPE string;
DEFINE FIELD created_at ON TABLE conversations TYPE datetime;
DEFINE FIELD updated_at ON TABLE conversations TYPE datetime;

DEFINE FIELD user_id ON TABLE conversations TYPE int ASSERT $value != NONE;
RELATE conversations:user_id->belongs_to->users:id;

-- Make sure the id is unique
DEFINE INDEX conversation_id_index ON TABLE conversations FIELDS id UNIQUE;

-- Index on user_id to make getting all conversations for a user faster
DEFINE INDEX conversation_user_id_index ON TABLE conversations FIELDS user_id;
