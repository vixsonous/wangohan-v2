FROM node:18-alpine as development

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

CMD ["pnpm", "run", "dev"]

FROM node:18-alpine AS production

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ARG NEXT_PUBLIC_ORIGIN
ENV NEXT_PUBLIC_ORIGIN=${NEXT_PUBLIC_ORIGIN}

ARG NEXT_PUBLIC_BUCKET_URL
ENV NEXT_PUBLIC_BUCKET_URL=${NEXT_PUBLIC_BUCKET_URL}

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN pnpm run build && echo "✅ Build ran" && ls -la && ls -R .next || (echo "❌ Build failed" && exit 1)

EXPOSE 3000

CMD [ "pnpm", "start" ]