FROM node:22-alpine

RUN node -v
RUN npm -v

WORKDIR /app/backend

RUN apk add --update --no-cache autoconf bash libtool automake python3 py3-pip alpine-sdk openssh-keygen yarn nano

RUN yarn global add pm2

ADD docker/ecosystem.config.js /app/backend

# Install packages first so that Docker doesn't run `yarn install` if the packages haven't changed
# See https://making.close.com/posts/reduce-docker-image-size
ADD backend/package.json /app/backend
ADD backend/yarn.lock /app/backend
# `sharp`, pulled in transitively, downloads a prebuilt libvips binary from the
# GitHub releases during its install script. That download times out often enough
# to break the build, so give the install a few attempts.
RUN set -eu; \
    attempt=1; \
    until yarn install --frozen-lockfile; do \
      attempt=$((attempt + 1)); \
      if [ "$attempt" -gt 3 ]; then echo "yarn install failed after 3 attempts"; exit 1; fi; \
      echo "yarn install failed, retrying ($attempt/3) in 15s"; \
      sleep 15; \
    done; \
    yarn cache clean

ADD backend /app/backend

EXPOSE 3000

CMD [ "pm2-runtime", "ecosystem.config.js" ]
