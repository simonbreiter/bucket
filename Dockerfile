FROM node:9.9.0

MAINTAINER Simon Breiter hello@simonbreiter.com

# Setup project folder
WORKDIR /usr

# Add project files
COPY src /usr/src
COPY package-lock.json /usr
COPY package.json /usr
COPY webpack.config.js /usr

EXPOSE 3000

RUN npm install
RUN npm run build