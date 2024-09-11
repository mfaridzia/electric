CREATE TABLE IF NOT EXISTS todos (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- INSERT INTO todos (id, title, completed, created_at) VALUES (gen_random_uuid(), 'Hello World', false, NOW());