import getAnimationTiles from "./get-animation-tiles";

export const TilesDimensions = {
    MAX_WIDTH: null,
    MAX_HEIGHT: null,
    H_TO_W_RATIO: null,
    W_TO_H_RATIO: null
};

function handleTileDimensions(dimensions) {
    const { width, height } = dimensions;
    TilesDimensions.MAX_WIDTH = Math.max(TilesDimensions.MAX_WIDTH, width);
    TilesDimensions.MAX_HEIGHT = Math.max(TilesDimensions.MAX_HEIGHT, height);
    TilesDimensions.H_TO_W_RATIO = TilesDimensions.MAX_WIDTH / TilesDimensions.MAX_HEIGHT;
    TilesDimensions.W_TO_H_RATIO = TilesDimensions.MAX_HEIGHT / TilesDimensions.MAX_WIDTH;
}

export const Tiles = {
    WALK: getAnimationTiles("Walk", 10, handleTileDimensions),
    ATTACK: getAnimationTiles("Attack", 8, handleTileDimensions)
};
