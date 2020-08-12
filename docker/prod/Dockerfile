#############
### build ###
#############

# base image
FROM node:11.10.0-alpine as builder

# create any needed dependencies directories and copy sources
# for example,
# WORKDIR /usr/src/commons
# COPY /path/to/commons /usr/src/commons

# create app directory
WORKDIR /usr/src/app

# install app dependencies
COPY ./package*.json ./
RUN npm ci --only=production

# copy app source
COPY . ./

# generate build
RUN npm run build

# #############
# ### serve ###
# #############

# base image
FROM nginx:1.17.8-alpine

# copy artifact build from the 'build environment'
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# copy nginx conf files to override the default ones
# for example,
# COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
