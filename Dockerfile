FROM node:14.15.4-alpine3.10

# create application directory
RUN mkdir /home/node/app/ && chown -R node:node /home/node/app

# switch to application directory
WORKDIR /home/node/app

# copy files
ADD --chown=node:node . .

# change user
USER node

# build application
RUN yarn && yarn build && yarn cache clean && rm -rf src tsconfig.json

# app port
EXPOSE 8080
EXPOSE 8043

CMD [ "node", "."]
