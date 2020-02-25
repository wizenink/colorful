# build environment
FROM node:13.8-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install 
RUN npm install react-scripts@3.0.1 -g --silent
COPY . /app
#RUN  npm run build
CMD ["npm","start"]

# production environment
#FROM nginx:1.16.0-alpine
#COPY --from=build /app/build /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
