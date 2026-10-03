# syntax=docker/dockerfile:1.4
# Build context: the repository root (the reference app builds the workspace packages).

FROM node:24.13.1-alpine3.23 AS base

LABEL description="Utensil Reference"

## Install bun
COPY --from=oven/bun:1.3.14-alpine /usr/local/bin/bun /usr/local/bin/
RUN ln -s /usr/local/bin/bun /usr/local/bin/bunx

## BUILDER: Set up build environment
FROM base AS builder

WORKDIR /app

# Copy workspace manifests first for better layer caching
COPY package.json bun.lock ./
COPY packages/css/package.json packages/css/
COPY packages/vue/package.json packages/vue/
COPY apps/reference/package.json apps/reference/

# Copy entrypoint after dependencies to avoid rebuilding deps
COPY apps/reference/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Install dependencies (this layer won't rebuild unless dependencies change)
RUN bun install --frozen-lockfile

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

## DEV: This stage will be skipped unless it is the target
## Build with --target=dev and mount the repository at /app on run
FROM builder AS dev

COPY apps/reference/development.sh /usr/local/bin/development.sh
RUN chmod +x /usr/local/bin/development.sh

ENTRYPOINT ["/usr/local/bin/development.sh"]
CMD ["bun", "run", "dev"]

EXPOSE 12911

## BUILD: Build the packages, then the reference app against their dist output
FROM builder AS build

COPY . .

RUN bun run build:reference

## PRODUCT: Exclude build environment and finalise product
FROM nginx:1.19.9-alpine AS product

WORKDIR /app

COPY --from=build /app/apps/reference/dist /app/dist
COPY --from=builder /usr/local/bin/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY apps/reference/nginx.conf.template ./

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80/tcp
