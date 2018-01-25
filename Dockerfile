FROM node:latest
WORKDIR /app
ADD . .
RUN npm install && npm run build
CMD npm run start