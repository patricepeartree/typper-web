#!/bin/bash

IMAGE_NAME=typper-web-local
PROJECT_SRC="/home/patricia/Projects/typper-web-DEV"
REACT_PORT=3000
EMULATOR_UI_PORT=4000
HOSTING_PORT=5000
CONTAINER_NAME=typper-web-local

#######################################################################################################################

start() {
	if [ ! "$(docker ps -q -f name="$CONTAINER_NAME")" ]; then
		if [ "$(docker ps -a -q -f name="$CONTAINER_NAME")" ]; then
			echo "Found a stoped \"$CONTAINER_NAME\" container. Starting it..."
			docker start "$CONTAINER_NAME"
		else
			echo "No \"$CONTAINER_NAME\" container found. Building image and creating a new container..."
			docker build -f Dockerfile-dev -t "$IMAGE_NAME" .
			docker run -tid -v "$PROJECT_SRC":/usr/src \
				-p "$REACT_PORT":3000 -p "$HOSTING_PORT":5000 -p "$EMULATOR_UI_PORT":4000 \
				-e CHOKIDAR_USEPOLLING=true --name "$CONTAINER_NAME" "$IMAGE_NAME" //bin/bash
		fi
	else
		echo "Found a running \"$CONTAINER_NAME\" container. Attaching to it..."
	fi
	docker exec -it "$CONTAINER_NAME" /bin/bash
}

# case "$1" in
#     "start") start;;
# 	*) echo "$(basename "$0"): Only \"start\" is a valid command.";;
# esac

start;
