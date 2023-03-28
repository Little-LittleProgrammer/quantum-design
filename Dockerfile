# syntax = docker/dockerfile:experimental
FROM registry.cn-hangzhou.aliyuncs.com/cr-test-docker/base-env:v1 as builder

WORKDIR /projects

COPY ./pnpm-lock.yaml /projects/pnpm-lock.yaml
# --mount=type=cache,target=/root/.local/share \
RUN  pnpm fetch

COPY . /projects

ARG projectName
RUN pnpm install -r --offline && \
    pnpm run build --filter ${projectName}

FROM registry.cn-hangzhou.aliyuncs.com/cr-test-docker/nginx:v1
ADD nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder projects/dist /usr/share/nginx/html