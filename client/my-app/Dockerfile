#Specify a base image (node:alpine tiny node img has npm inside)
FROM node:20
#specifiy base working dir (./), would be automatically created
WORKDIR /app
#Commands to run when creating image
#copy from buildContext(THIS MACHINE) to the container
#split copy to two steps to avoid cache invalidation
COPY ./package.json ./
RUN npm install
COPY ./ ./
#Commands to run when running a container
CMD ["npm","start"]
#docker build -t karim/simpleweb .