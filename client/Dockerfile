# https://bit.ly/node-docker-best-practice
# This is a multistage Dockerfile.
# In the first stage we install system build dependencies, copy project files and build them
# In the second stage, we start fresh and only copy necessary files. We also purge node_modules devDependencies.

#### --- Build stage --- ####
FROM node:16-alpine AS build

# Update npm to latest version
RUN npm i -g npm

# Only copy node dependency information and install all dependencies first
COPY --chown=node:node package.json package-lock.json ./

# Install packages using the lockfiles as source of truth ✅ See bullet point #8.5 about npm ci
# Don't use postinstall scripts to build the app. The source code files are not copied yet.
RUN npm ci

# Copy source code (and all other relevant files)
COPY --chown=node:node . .

# Build code (TypeScript)
RUN npm run build

#### --- Run-time stage --- ####

# ✅ See bullet point #8.10 about smaller docker base images
FROM alpine

# Install thttpd
RUN apk add thttpd

# Create a non-root user to own the files and run our server
RUN adduser -D static
USER static
WORKDIR /home/static

# Copy the static website
# Use the .dockerignore file to control what ends up inside the image!
COPY --chown=static:static --from=build dist .

# Run thttpd
CMD ["thttpd", "-D", "-h", "0.0.0.0", "-p", "3000", "-d", "/home/static", "-u", "static", "-l", "-", "-M", "60"]