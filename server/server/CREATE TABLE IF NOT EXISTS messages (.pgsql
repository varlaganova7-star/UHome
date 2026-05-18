CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY,
    sender_role VARCHAR(50) NOT NULL,
    sender_name VARCHAR(100) NOT NULL,
    recipient_role VARCHAR(50) NOT NULL DEFAULT 'admin',
    text TEXT NOT NULL,
    media JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
CREATE INDEX idx_messages_roles ON messages(sender_role, recipient_role);