FROM node:16
 
WORKDIR /apps/client
 
# Copy root package.json and lockfile
COPY package.json ./
COPY package-lock.json ./
 
# Copy the docs package.json
COPY apps/client/package.json ./apps/client/package.json
 
RUN npm install
 
# Copy app source
COPY . .
 
EXPOSE 3000
 
CMD [ "npm","run","dev"]