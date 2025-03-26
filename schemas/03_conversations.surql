DEFINE TABLE conversations SCHEMAFULL;

DEFINE FIELD id ON TABLE conversations TYPE string ASSERT $value != NONE;
DEFINE FIELD name ON TABLE conversations TYPE string ASSERT $value != NONE;
DEFINE FIELD created_at ON TABLE conversations TYPE string VALUE <string>time::now();
DEFINE FIELD updated_at ON TABLE conversations TYPE string VALUE <string>time::now();

DEFINE FIELD user_id ON TABLE conversations TYPE string ASSERT $value != NONE AND record::exists(type::thing("users", $value));
RELATE conversations:user_id->belongs_to->users:id;

-- Make sure the id is unique
DEFINE INDEX conversation_id_index ON TABLE conversations FIELDS id UNIQUE;

-- Index on user_id to make getting all conversations for a user faster
DEFINE INDEX conversation_user_id_index ON TABLE conversations FIELDS user_id;
