FROM node:8-alpine

ENV NODE_ENV production

COPY . /app/
WORKDIR /app

RUN npm install --production

CMD ["npm", "start", "--", "AB5,BC4,CD8,DC8,DE6,AD5,CE2,EB3,AE7"]
