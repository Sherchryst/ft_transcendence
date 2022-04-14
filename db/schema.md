# ft_transcendence - Database Schema Reference

**Notes:**
- All primary keys are underlined.
- All foreign keys are in italics.

## Users

### - user(<ins>id</ins>, login, nickname, mmr, twofa, new_user, avatar_path)

- id: INT
	- An unique identifier for the user which is independant from 42.
- login: VARCHAR(32) UNIQUE
	- The login of the user retrieved from the 42 intranet.
- nickname: VARCHAR(32) UNIQUE
	- The user should be able to choose a unique name that will be displayed on the website.
- xp: INT NOT NULL DEFAULT 0
	- The experience points of the user.
- twofa: VARCHAR(32) DEFAULT NULL
	- A secret used to generate a 2FA code.
	- If NULL then the user does not use 2FA.
- new_user: BOOL NOT NULL DEFAULT TRUE
	- True if the user has not set a nickname yet False otherwise.
- avatar_path: VARCHAR(64) NOT NULL DEFAULT `avatars/default.jpg`
	- The path to the avatar of the user.

### - user_relationship(<ins>*from_id*, *to_id*</ins>, type, created_at)

- from_id: INT
	- The id of the first user.
- to_id: INT
	- The id of the second user.
	- to_id <> from_id.
- type: ENUM NOT NULL
	- `block`: The first user blocked the second user.
		- The relation is asymmetric, so only the first user will not be able to see the second user's messages.
		- The relation is symmetric if the second user blocks the first user.
	- `friend`: The two users are friends.
		- This relation is symmetric, it implies that the second user is also a friend of the first user.
	- `pending`: The first user sent a friend request to the second user.
- created_at: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	- The date of the creation of the relation.

### - achievement(<ins>id</ins>, name, description)

- id: INT
	- An unique identifier for the achievement.
- name: VARCHAR(64) UNIQUE
	- The name of the achievement.
- description: VARCHAR(128) NOT NULL
	- A short description of the achievement.

### - user_achievement(<ins>*user_id*, *achievement_id*</ins>, unlocked_at)

- user_id: INT
	- The id of the user.
- achievement_id: INT
	- The id of the achievement.
- unlocked_at: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	- The date the achievement was unlocked.

## Chat

### - channel(<ins>id</ins>, name, *owner_id*, visibility, password)

- id: INT
	- An unique identifier for the channel.
- name: VARCHAR(32) UNIQUE
- owner_id: INT NOT NULL
	- The owner is a channel administrator.
	- The owner can promote members to channel admnistrators and demote channel administrators (except himself).
	- The owner can delete the channel.
	- If the owner leaves the channel, the channel is deleted.
- visibility: ENUM NOT NULL DEFAULT `private`
	- `private`: The group is private.
	- `public`: The group is public.
- password: VARCHAR(32)
	- The stored password is hashed.
	- The password used to join the channel as an user.
	- The password must not be asked to the user if he was invited to join the channel.
	- If NULL then the channel is not password protected.

### - channel_member(<ins>*channel_id*, *user_id*</ins>, role, last_read_at)

- channel_id: INT
	- The id of the channel.
- user_id: INT
	- The user is a member of the channel.
- role: ENUM NOT NULL DEFAULT `member`
	- `admin`: The user is a moderator of the channel.
		- A channel administrator can ban or mute users except channel owner.
	- `member`: The user is a member of the channel.
		- The user can send messages to the channel if not banned or muted.
- last_read_at: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	- The date at which the user last read the channel messages.
	- Any messages received after the last read date should be considered as unread.

### - channel_invitation(<ins>*channel_id*, *to_id*</ins>, *from_id*, sent_at)

- channel_id: INT
	- The id of the channel.
- to_id: INT
	- The user who was invited to the channel.
- from_id: INT NOT NULL
	- The user who sent the invitation.
- sent_at: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	- The date at which the invitation was sent.

### - channel_moderation(<ins>*channel_id*, *user_id*</ins>, *admin_id*, type, reason, begin_at, expire_at, pardon_at)

- channel_id: INT
	- The id of the channel where the moderation act was performed.
- user_id: INT
	- The id of the user concerned by the moderation act.
- admin_id: INT NOT NULL
	- The id of the user who performed the action.
	- admin_id <> user_id.
- type: ENUM NOT NULL
	- `ban`: The user was banned from the channel.
	- `mute`: The user was muted in the channel.
- reason: VARCHAR(128) NOT NULL DEFAULT \'No reason\'
	- The reason of the moderation act.
- begin_at: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	- The date at which the moderation act was performed.
- expire_at: TIMESTAMP DEFAULT NULL
	- The date at which the moderation act will expire.
	- If NULL then the moderation act is permanent.
- pardon_at: TIMESTAMP DEFAULT NULL
	- The date at which the moderation act was pardoned.
	- If NULL then the moderation act is not pardoned.

### - message(<ins>id</ins>, *from_id*, content, sent_at)

- id: INT
	- An unique identifier for the message.
- from_id: INT NOT NULL
	- The id of the user who sent the message.
- content: VARCHAR(512) NOT NULL
	- The content of the message.
- sent_at: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	- The date at which the message was sent.

### - channel_message(<ins>*channel_id*, *message_id*</ins>)

- channel_id: INT
	- The id of the channel.
- message_id: INT
	- The id of the message.

### - direct_message(<ins>*message_id*, *to_id*</ins>, read_at)

- message_id: INT
	- The id of the message.
- to_id: INT
	- The id of the user who received the message.
- read_at: TIMESTAMP DEFAULT NULL
	- The date at which the message was read.
	- If NULL then the message is not read.

## Game

### - map(<ins>id</ins>, ball_color, background_color, stars_color, racket_color)

- id: INT
	- An unique identifier for the map.
- ball_color: INT NOT NULL
	- The color of the ball.
- background_color: INT NOT NULL
	- The color of the background.
- stars_color: INT NOT NULL
	- The color of the stars.
- racket_color: INT NOT NULL
	- The color of the racket.

### - match_invitation(<ins>*from_id*, *to_id*</ins>, *map_id*, sent_at)

- from_id: INT NOT NULL
	- The id of the user who sent the invitation.
- to_id: INT NOT NULL
	- The id of the user who was invited to the match.
- map_id: INT NOT NULL
	- The id of the map used in the match.
- sent_at: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	- The date at which the invitation was sent.

### - match(<ins>id</ins>, *map_id*, *player1_id*, *player2_id*, mode, begin_at, end_at, *winner_id*, score1, score2)

- id: INT
	- An unique identifier for the match.
- map_id: INT NOT NULL
	- The unique id of the map.
- player1_id: INT NOT NULL
	- The id of the first user.
- player2_id: INT
	- The id of the second user.
	- If NULL then the match is a single player match.
	- player2_id <> player1_id.
- mode: ENUM NOT NULL
	- `casual`: The match is a casual match.
	- `ranked`: The match is a ranked match.
- begin_at: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	- The date at which the match was started.
- end_at: TIMESTAMP DEFAULT NULL
	- The date at which the match was finished.
	- If NULL then the match is not finished.
- winner_id: INT DEFAULT NULL
	- The id of the winner.
	- The winner is not always the one with the highest score (avoid disconnect exploit).
	- If NULL then the match is not finished.
- score1: INT NOT NULL DEFAULT 0
	- The score of the first user.
- score2: INT NOT NULL DEFAULT 0
	- The score of the second user.
