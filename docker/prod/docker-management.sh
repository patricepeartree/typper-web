#!/bin/bash

usage() {
	echo
	echo "Usage:  $0 COMMAND"
	echo  
	echo "Commands:"
	echo "  build     Build a new image for this project."
    echo "  start     Run a new container from the latest image for this project."
	echo "  stop      Stop and remove the container created using \"start\"."
	exit 0
}

[[ $# -eq 0 ]] && usage

DIR="$(cd $(dirname ${BASH_SOURCE[0]}) >/dev/null 2>&1 && pwd)"
source "$DIR/variables"

IMAGE_TAG_VERSION="$IMAGE_NAME:$IMAGE_VERSION"
IMAGE_TAG_LATEST="$IMAGE_NAME:latest"

PRIMARY_COLOR='\033[1;32m'
SECONDARY_COLOR='\033[0;35m'
FADED_COLOR='\033[0;90m'
INPUT_COLOR='\033[0;33m'
NEUTRAL_COLOR='\033[0;97m'
NO_COLOR='\033[0m'
OPENING_COLOR='\033[0;32m'
printHighlightPrimary() {
	printf "$PRIMARY_COLOR%s$NEUTRAL_COLOR" "$*"
}
printHighlightSecondary() {
	printf "$SECONDARY_COLOR%s$NEUTRAL_COLOR" "$*"
}
printFaded() {
	printf "$FADED_COLOR%s$NEUTRAL_COLOR" "$*"
}
userInputColor() {
	printf "$INPUT_COLOR%s" ""
}
resetTextColor() {
	printf "$NEUTRAL_COLOR%s" ""
}
opening() {
	local STRING
	if [ "$1" -eq "0" ]; then 
		STRING="\n#"
	else 
		STRING="$(head -c $1 < /dev/zero | tr '\0' ' ')\`-"
	fi
	printf "$OPENING_COLOR%s$NEUTRAL_COLOR " "$STRING"
}
message() {
	printf "$(opening $1)$NEUTRAL_COLOR%s\n" "$2"
}
step() {
	printf "\n$OPENING_COLOR%s$NEUTRAL_COLOR %s\n" "[ Step $1/$2 ]" "$3"
}

YES=1
NO=0
yesOrNo() {
	RESULT=
	local RESP
	while true; do
		read -p "$(opening $1)$2 $(printFaded [Y/n]) $(userInputColor)" RESP
		resetTextColor
		case $RESP in
			[Yy]*) RESULT=$YES; break;;
			[Nn]*) RESULT=$NO; break;;
		esac
	done
}

promptAndWait() {
	RESULT=
	local RESP
	while [ -z "$RESP" ]; do
		read -p "$(opening $1)$2 $(userInputColor)" RESP
		resetTextColor
	done
	RESULT=$RESP
}

build() {
	local TOTAL_STEPS=2

	step 1 $TOTAL_STEPS "Setup Image Tag"

	message 0 "The new image will be tagged with $(printHighlightPrimary $IMAGE_VERSION) ($(printHighlightSecondary $IMAGE_TAG_VERSION))."
	yesOrNo 1 "Do you want to change the tag?"
	if [ "$RESULT" == "$YES" ]; then
		promptAndWait 2 "And the new tag will be?"
		NEW_TAG=$RESULT
		message 0 "The tag will also be updated in the variables file (the $(printHighlightSecondary IMAGE_VERSION) variable will be overriden)."
		yesOrNo 1 "Do you want to continue?"
		if [ "$RESULT" == "$YES" ]; then
			sed -i -e "s/IMAGE_VERSION=$IMAGE_VERSION/IMAGE_VERSION=$NEW_TAG/g" "$DIR/variables"
			IMAGE_VERSION="$NEW_TAG"
		fi
	fi

	step 2 $TOTAL_STEPS "Build Image"

    DOCKER_BUILDKIT=1 docker build -f "${DIR}/Dockerfile" -t "$FULL_IMAGE_VERSION" -t "$FULL_IMAGE_LATEST" "$PROJECT_SRC"
}

start() {
	docker run -d -p "$HOST_PORT":80 --name "$CONTAINER_NAME" "$FULL_IMAGE_LATEST"
}

stop () {
	docker stop "$CONTAINER_NAME"
	docker rm "$CONTAINER_NAME"
}

wrongCommand() {
	echo "$(basename "$0"): '$1' is not a valid command."
	echo "Run '$0' to view a list of the valid commands."
	exit 1
}

case "$1" in
    "build") build;;
    "start") start;;
    "stop") stop;;
	*) wrongCommand "$1";;
esac