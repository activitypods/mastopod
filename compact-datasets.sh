#!/bin/bash

# Stop all containers including Fuseki
make stop-prod

docker run --volume="$(pwd)"/data/fuseki:/fuseki --entrypoint=/docker-compact-entrypoint.sh semapps/jena-fuseki-webacl

make start-prod
