DEFINE TABLE chat_records SCHEMAFULL;

DEFINE FIELD id ON TABLE chat_records TYPE string ASSERT $value != NONE;
DEFINE FIELD prompt ON TABLE chat_records TYPE string;
DEFINE FIELD reply ON TABLE chat_records TYPE string;
DEFINE FIELD prompt_images ON TABLE chat_records TYPE array<string> DEFAULT ALWAYS [];

DEFINE FIELD conversation_id ON TABLE chat_records TYPE string ASSERT $value != NONE AND record::exists(type::thing("conversations", $value));
RELATE chat_records:conversation_id->belongs_to->conversations:id;

-- Make sure the id is unique
DEFINE INDEX chat_record_id_index ON TABLE chat_records FIELDS id UNIQUE;

-- Index on conversation_id to make getting all chat_records for a conversation faster
DEFINE INDEX chat_record_conversation_id_index ON TABLE chat_records FIELDS conversation_id;
