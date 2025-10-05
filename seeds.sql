-- Users
INSERT INTO users (username, password) VALUES ('alice', 'pass1');
INSERT INTO users (username, password) VALUES ('bob',   'pass2');

-- Memes (uses ids 1 and 2 from the two inserts above)
INSERT INTO memes (title, url, user_id)
VALUES 
('Distracted Boyfriend', 'https://i.imgur.com/example1.jpg', 1),
('Success Kid',          'https://i.imgur.com/example2.jpg', 1),
('Doge',                 'https://i.imgur.com/example3.jpg', 2);
