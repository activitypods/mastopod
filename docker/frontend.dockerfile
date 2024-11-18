FROM node:20-alpine

RUN node -v
RUN npm -v

WORKDIR /app/frontend

RUN apk add --update --no-cache autoconf bash libtool automake python3 py3-pip alpine-sdk openssh-keygen yarn nano

RUN yarn global add serve

ARG VITE_APP_NAME
ARG VITE_PORT
ARG VITE_BACKEND_URL
ARG VITE_BACKEND_CLIENT_ID
ARG VITE_POD_PROVIDER_BASE_URL

ENV VITE_APP_NAME=${VITE_APP_NAME}
ENV VITE_PORT=${VITE_PORT}
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_BACKEND_CLIENT_ID=${VITE_BACKEND_CLIENT_ID}
ENV VITE_POD_PROVIDER_BASE_URL=${VITE_POD_PROVIDER_BASE_URL}

# Install packages first so that Docker doesn't run `yarn install` if the packages haven't changed
# See https://making.close.com/posts/reduce-docker-image-size
ADD frontend/package.json /app/frontend
ADD frontend/yarn.lock /app/frontend
RUN yarn install && yarn cache clean

ADD frontend /app/frontend

RUN yarn run build

EXPOSE 4000

CMD serve -s dist -l 4000
