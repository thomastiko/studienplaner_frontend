# Stage 1: Build the Vue.js frontend
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]