-- Filter memes by user_id
SELECT * FROM memes WHERE user_id = 1;

-- Join usernames with their memes
SELECT u.username, m.title, m.url
FROM users u
JOIN memes m ON u.id = m.user_id
ORDER BY u.username, m.title;

-- LEFT JOIN: include users even without memes
SELECT u.username, m.title, m.url
FROM users u
LEFT JOIN memes m ON u.id = m.user_id
ORDER BY u.username, m.title NULLS LAST;
