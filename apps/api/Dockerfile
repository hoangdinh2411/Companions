FROM node:16
 
WORKDIR /apps/api
 
# Copy root package.json and lockfile
COPY package.json ./
COPY package-lock.json ./
 
# Copy the docs package.json
COPY apps/api/package.json ./apps/api/package.json
 
RUN npm install
 
# Copy app source
COPY . .
 
EXPOSE 2703
 
CMD [ "npm","start"]