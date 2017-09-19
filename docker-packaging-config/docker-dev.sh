#!/bin/bash

set -e

docker network create --driver overlay docker-data-backup-network || true

mkdir -p ./tmp/output-backup
mkdir -p ./tmp/output-storage

npm run packaging:prepare
npm run packaging:image-build dev
npm run packaging:image-push dev
npm run packaging:service-deploy dev

sleep 15

DEV_CONTAINER=$(docker ps | grep docker-data-backup_app | cut -d" " -f1)
echo $DEV_CONTAINER
docker exec -ti $DEV_CONTAINER /opt/app/docker-dev-exec.sh
