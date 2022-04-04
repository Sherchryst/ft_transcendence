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

INSERT INTO "map" ("ball_color", "background_color", "stars_color", "racket_color") VALUES
(CAST(x'fcba03' AS int), CAST(x'054257' AS int), CAST(x'bfbeb2' AS int), CAST(x'ffffff' AS int));
