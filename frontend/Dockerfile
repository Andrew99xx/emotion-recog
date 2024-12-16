# Use Node.js as the base image for building
FROM node:18 as build

# Set the working directory inside the container
WORKDIR /app

# Copy the frontend files into the container
COPY . /app

# Install dependencies and build the frontend
RUN npm install
RUN npm run build

# Use a lightweight web server to serve the frontend
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
