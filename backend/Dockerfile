# Stage 1: build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

# Stage 2: run
FROM node:18
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 4000
CMD ["npm", "start"]
