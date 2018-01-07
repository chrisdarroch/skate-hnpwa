#! /bin/sh

yarn build
node node/server/index.js &
