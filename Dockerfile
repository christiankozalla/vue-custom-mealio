# build stage
FROM node:lts-alpine as build-stage

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

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]