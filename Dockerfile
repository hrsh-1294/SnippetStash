FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Step 2: Serve the app using a lightweight server
FROM nginx:alpine

# Copy build output to NGINX's public directory
COPY --from=builder /app/dist /usr/share/nginx/html

#nginx port-> 80
EXPOSE 80 

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
