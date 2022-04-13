C=
CMD=sh
CE=front


all:
	docker-compose up -d --build $(C)

build:
	docker-compose build $(C)

up:
	docker-compose up -docker $(C)

stop:
	docker-compose stop $(C)

rm: stop
	docker-compose rm -f $(C)

down:
	docker-compose down

down-v:
	docker-compose down -v

re: rm all

logs:
	docker-compose logs -f $(C)

exec:
	docker-compose exec $(CE) $(CMD)

.PHONY: all build up exec stop rm down down-v re logs exec