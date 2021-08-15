# frontend-build stage
FROM node:lts-alpine as frontend-build-stage

# Make the 'fronted-app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY ./frontend-app/package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current WORKDIR (i.e 'app')
COPY ./frontend-app .

# build app for production
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=frontend-build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]





# Example Dockerfile how to dockerize Nodejs app AND Vue app together

# Example repo: https://github.com/bbachi/vuejs-nodejs-example

# FROM node:10 AS ui-build
# WORKDIR /usr/src/app
# COPY my-app/ ./my-app/
# RUN cd my-app && npm install && npm run build

# FROM node:10 AS server-build
# WORKDIR /root/
# COPY --from=ui-build /usr/src/app/my-app/build ./my-app/build
# COPY api/package*.json ./api/
# RUN cd api && npm install
# COPY api/server.js ./api/

# EXPOSE 3080

# CMD ["node", "./api/server.js"]