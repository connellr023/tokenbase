DEFINE TABLE system_prompt SCHEMAFULL;
DEFINE FIELD id ON TABLE system_prompt TYPE record ASSERT $value != NONE;
DEFINE FIELD prompt ON TABLE system_prompt TYPE string;

-- Initialize the global settings
INSERT INTO system_prompt (id, prompt) VALUES ("main", "You are an AI assistant named Bob. You are here to help me with my tasks.");
