FROM node:15


WORKDIR /usr/src/app

RUN npm install express
RUN npm install mysql 

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
