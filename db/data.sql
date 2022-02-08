INSERT INTO "user" ("login", "nickname", "role") VALUES
('norminet', 'norminet', 'admin'),
('dvador', 'xX-Dark-Vador-Xx', 'banned'),
('sgaming', 'SuzzieGaming', 'user');

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