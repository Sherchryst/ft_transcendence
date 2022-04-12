INSERT INTO "user" ("login", "nickname") VALUES
('norminet', 'norminet'),
('dvador', 'xX-Dark-Vador-Xx'),
('sgaming', 'SuzzieGaming');

INSERT INTO "achievement" ("name", "description") VALUES
('achiev1', 'desc1'),
('achiev2', 'desc2'),
('achiev3', 'desc3');

INSERT INTO "user_achievement" ("user_id", "achievement_id") VALUES
(1, 1), (1, 3),
(2, 3),
(3, 2), (3, 3);

INSERT INTO "user_relationship" VALUES
('friend', 1, 3),
('friend', 3, 1),
('block', 1, 2);

INSERT INTO "game_map" ("ball_color", "background_color", "stars_color", "racket_color") VALUES
(CAST(x'fcba03' AS int), CAST(x'054257' AS int), CAST(x'bfbeb2' AS int), CAST(x'ffffff' AS int));

INSERT INTO "game_map" ("ball_color", "background_color", "stars_color", "racket_color") VALUES
(CAST(x'b00b69' AS int), CAST(x'0e1125' AS int), CAST(x'b48700' AS int), CAST(x'833260' AS int));

INSERT INTO "achievement" ("name", "description") VALUES
('You are LOSER', 'Lose 1 match'),
('You are a WINNER', 'Win 5 matches'),
('Perfect', 'Win a match taking no casualties'),
('Traveler', 'Make a match on each of the maps');

INSERT INTO "user_achievement" ("user_id", "achievement_id") VALUES
(1, 1), (1, 3);

INSERT INTO "match" ("mode", "begin_at", "score1", "score2", "map_id", "player1_id", "player2_id", "winner_id") VALUES
('ranked', CURRENT_TIMESTAMP, 11, 0, 1, 1, 2, 1);
