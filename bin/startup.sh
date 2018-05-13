#! /bin/sh

yarn server/build
if [[ ${NODE_ENV} = "production" ]]; then
    yarn client/build
else
    yarn client/watch &
fi

yarn server/run
