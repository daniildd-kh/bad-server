FROM node:22-alpine
RUN mkdir /app
#RUN mkdir -p /app/src/public/temp
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]
