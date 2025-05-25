-- meant to store words of the day
-- which is why date is unique here
CREATE TABLE words (
    word TEXT NOT NULL PRIMARY KEY,
    word_date date NOT NULL UNIQUE
);

-- meant for custom wordles. users 
-- can optionally protect their custom
-- wordles using passwords
CREATE TABLE user_defined_words (
    id TEXT PRIMARY KEY, -- short uuid
    word TEXT NOT NULL,
    hashed_password TEXT
);
