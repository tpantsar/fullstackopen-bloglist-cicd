FROM node:22 AS build-stage

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN rm -rf dist && npm ci && npm run build
