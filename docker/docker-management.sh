#!/bin/bash

IMAGE_NAME=node:12.8.1
PROJECT_SRC="/home/patricia/Projects/typper-web"
HOST_PORT=3010
CONTAINER_NAME=typper-web-local

#######################################################################################################################

usage() {
	echo
	echo "Usage:  $0 COMMAND"
	echo  
	echo "Commands:"
	echo "  start     Run a new container for this project. "
	echo "  stop      Stop and remove the container created using \"start\"."
	echo "  attach    Attach to the command line of the container created using \"start\"."
	exit 0
}

[[ $# -eq 0 ]] && usage

start() {
	docker run -tid -w //usr/src -v "$PROJECT_SRC":/usr/src -p "$HOST_PORT":3000 -e CHOKIDAR_USEPOLLING=true --name "$CONTAINER_NAME" "$IMAGE_NAME" //bin/bash
}

stop() {
	docker stop "$CONTAINER_NAME"
	docker rm "$CONTAINER_NAME"
}

attach() {
	docker attach "$CONTAINER_NAME"
}

wrongCommand() {
	echo "$(basename "$0"): '$1' is not a valid command."
	echo "Run '$0' to view a list of the valid commands."
	exit 1
}

case "$1" in
    "start") start;;
    "stop") stop;;
	"attach") attach;;
	*) wrongCommand "$1";;
esac
