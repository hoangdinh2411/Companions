
FROM node:20.2-alpine3.17 as base

# Install turbo and typescript globally
RUN  npm install turbo typescript --global 


# prune the dependencies
FROM base AS pruned
WORKDIR /app

COPY . .

RUN turbo prune --scope=api --docker

# Copy the pruned dependencies to the installer
FROM base AS installer
WORKDIR /app

COPY --from=pruned /app/out/json/ .
COPY --from=pruned /app/out/package-lock.json /app/package-lock.json

RUN npm install

# Forces the layer to recreate if the app's package.json changes
COPY apps/api/package.json /app/apps/api/package.json


COPY --from=pruned /app/out/full/ .
COPY turbo.json turbo.json

# For example: `--filter=api^...` means all of api's dependencies will be built, but not the api app itself (which we don't need to do for dev environment)
RUN turbo run build --no-cache --filter=api^...



#############################################
FROM base AS runner
WORKDIR /app


COPY --from=installer /app .

CMD npm run dev