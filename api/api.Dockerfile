FROM node:12.16.1

ENV YARN_VERSION 1.22.4
RUN curl -fSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
    && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
    && rm yarn-v$YARN_VERSION.tar.gz

# Create app directory
WORKDIR /usr/src/voting-system

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN yarn install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "yarn", "start" ]