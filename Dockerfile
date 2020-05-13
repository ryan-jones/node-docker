FROM node:11-slim
WORKDIR /usr/src
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]