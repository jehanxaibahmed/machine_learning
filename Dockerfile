# FROM node:14
# # Create app directory
# WORKDIR /usr/src/app
# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)
# COPY package.json ./

# RUN npm install --force
# # If you are building your code for production
# # RUN npm ci --only=production
# # Bundle app source

# EXPOSE 3000
# CMD [ "npm", "start"]

FROM nginx:1.19.0
COPY build/ /usr/share/nginx/html

# needed this to make React Router work properly 
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
RUN service nginx restart
# Expose port 80 for HTTP Traffic 
EXPOSE 80
# start the nginx web server
CMD ["nginx", "-g", "daemon off;"]