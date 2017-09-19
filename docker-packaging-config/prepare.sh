#!/bin/bash

set -e

npm install
npm run lint
cp -R $PROJECT_DIR/node_modules $PACKAGING_FILES
cp -R $PROJECT_DIR/src $PACKAGING_FILES

mkdir $PACKAGING_FILES/dev
cp $PROJECT_DIR/package.json $PACKAGING_FILES/dev
cp $PROJECT_DIR/.eslintrc $PACKAGING_FILES/dev
cp $PACKAGING_CONFIG/docker-dev-exec.sh $PACKAGING_FILES/dev
