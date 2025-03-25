DEFINE TABLE chat_records SCHEMAFULL;

LET $latest_chat_record_id = SELECT id FROM chat_records ORDER BY id DESC LIMIT 1;

DEFINE FIELD id ON TABLE chat_records TYPE int VALUE $latest_chat_record_id + 1;
DEFINE FIELD prompt ON TABLE chat_records TYPE string;
DEFINE FIELD reply ON TABLE chat_records TYPE string;
DEFINE FIELD prompt_images ON TABLE chat_records TYPE array;
DEFINE FIELD prompt_images.* ON TABLE chat_records TYPE string;

DEFINE FIELD conversation_id ON TABLE chat_records TYPE int ASSERT $value != NONE;
RELATE chat_records:conversation_id->belongs_to->conversations:id;

-- Make sure the id is unique
DEFINE INDEX chat_record_id_index ON TABLE chat_records FIELDS id UNIQUE;

-- Index on conversation_id to make getting all chat_records for a conversation faster
DEFINE INDEX chat_record_conversation_id_index ON TABLE chat_records FIELDS conversation_id;
