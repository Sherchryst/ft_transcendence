SELECT u.id, u.login, u.nickname, u.xp, u.avatar_path, COUNT(m) AS wins, t.total, COUNT(m)::float / t.total AS win_rate
FROM "user" u
LEFT OUTER JOIN "match" m
ON m.mode = 'ranked'
AND m.winner_id = u.id
JOIN (
	SELECT u.id, COUNT(m) AS total
	FROM "user" u
	JOIN "match" m
	ON m.mode = 'ranked'
	AND (m.player1_id = u.id OR m.player2_id = u.id)
	AND m.winner_id IS NOT NULL
	GROUP BY u.id
) t
ON t.id = u.id
GROUP BY u.id, t.total
ORDER BY xp DESC
LIMIT 10;
