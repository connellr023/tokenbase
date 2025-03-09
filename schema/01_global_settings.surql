DEFINE TABLE global_settings SCHEMAFULL;
DEFINE FIELD id ON TABLE global_settings TYPE string ASSERT $value != NONE;
DEFINE FIELD prompt ON TABLE global_settings TYPE string;

-- Initialize the global settings
INSERT INTO global_settings (id, prompt) VALUES ("main", "You are an AI assistant named Bob. You are here to help me with my tasks.");
