FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install typescript --save-dev

COPY . .

RUN npx tsc

EXPOSE 5713

CMD ["npm", "start"]