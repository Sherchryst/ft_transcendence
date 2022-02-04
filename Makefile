C=
CMD=sh
CE=back


all:
	docker-compose up -d --build

build:
	docker-compose build

up:
	docker-compose up -docker

stop:
	docker-compose stop

rm: stop
	docker-compose rm

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