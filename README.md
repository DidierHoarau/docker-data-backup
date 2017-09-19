# Docker-Data-Backup

Docker-Data-Backup is a set of containers implementing a simple backup mechanism for Docker containers

_Note_: This project is build for Docker Swarm cluster but it should be compatible with non-Swarm containers

## How does it work?

There are 2 services deployed:
* Backup: A copy of this container is deployed on all machines. This container will trigger the backup, collect the files and send the file to the storage container
* Storage: There is 1 copy of this container deployed. This container has a volume attached and will store the backup on disk

The configuration is made by adding labels to the target container
* docker-backup.name=nameofaservice
* docker-backup.max-age=36000000 (Desired backup interval for this service in miliseconds)
* docker-backup.command=/opt/script/backup.sh (Command to trigger the backup, inside the container)
* docker-backup.file=/opt/backups/foo.tar.gz (The file inside the container that will be collected afterward)

## How to run it?

This repo has been packaged with [https://github.com/DidierHoarau/docker-packaging] so to run it you have to execute...

For Docker Engine:
* Create the Docker network webproxy-network
* npm run packaging:prepare
* npm run packaging:image-build
* npm run packaging:service-run

For Docker Swarm:
* Set the environment variable DOCKER_REGISTRY
* Create the Docker network webproxy-network
* npm run packaging:prepare
* npm run packaging:image-build swarm
* npm run packaging:image-push swarm
* npm run packaging:service-deploy swarm
