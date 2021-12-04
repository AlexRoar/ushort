# syntax=docker/dockerfile:1
FROM node:14
WORKDIR /usr/src/app
VOLUME /usr/src/db
COPY . .
RUN npm install
RUN npx tsc
ENV PORT=80
EXPOSE 80
CMD ["npm", "start"]