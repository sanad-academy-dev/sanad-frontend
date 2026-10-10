# Build from this Dashboard directory:
#   docker build -t sanad-dashboard .
FROM oven/bun:1.3.14-alpine AS builder
WORKDIR /app

ARG VITE_API_URL
ARG VITE_SENTRY_DSN
ARG VITE_MAP_STYLE_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SENTRY_DSN=$VITE_SENTRY_DSN
ENV VITE_MAP_STYLE_URL=$VITE_MAP_STYLE_URL

COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache,sharing=locked \
    bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM oven/bun:1.3.14-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/ || exit 1

# The container only serves the already-built Dashboard. It does not contain
# Prisma, migrations, API routes, or backend environment secrets.
CMD ["bun", "run", ".output/server/index.mjs"]
