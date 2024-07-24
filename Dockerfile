FROM node:20.14.0-alpine

WORKDIR /app/backend

RUN chown node:node /app/backend

COPY --chown=node:node package*.json ./

USER node

RUN npm install --production

COPY --chown=node:node . .

EXPOSE 8000

CMD ["npm", "run", "start:prod"]
