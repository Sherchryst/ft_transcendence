FROM node:16-alpine3.14

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

USER node

RUN set -eux; \
	npm install -g \
	@nestjs/cli \
	@vue/cli \
	@stoplight/prism-cli \
	typeorm-cli

WORKDIR /app
