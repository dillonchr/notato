FROM node:16.13.1-alpine3.14
WORKDIR /code/
COPY package*.json ./
RUN npm i
COPY . .
CMD ["npm", "start"]
