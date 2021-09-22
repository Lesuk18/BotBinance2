FROM node:14-alpine

WORKDIR /usr/src/app

RUN apk update
RUN apk upgrade
RUN apk add --update alpine-sdk linux-headers git zlib-dev openssl-dev gperf php cmake
RUN git clone https://github.com/tdlib/td.git

WORKDIR /usr/src/app/td
RUN rm -rf build
RUN mkdir build

WORKDIR /usr/src/app/td/build
RUN cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX:PATH=../tdlib ..
RUN cmake --build . --target install -j 8

WORKDIR /usr/src/app/td/tdlib/lib

RUN ls 

RUN apk add --update python3

COPY package*.json ./

RUN npm install --only=production
RUN npm install node-gyp

COPY . ./

CMD ["node", "airgram.js"]
