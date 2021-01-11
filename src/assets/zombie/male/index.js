import getAnimationTiles, { Placeholders } from "@assets/get-animation-tiles";

export const TilesDimensions = {
    MAX_WIDTH: null,
    MAX_HEIGHT: null,
    H_TO_W_RATIO: null,
    W_TO_H_RATIO: null
};

// TODO should this be in an assets-util?
function handleTileDimensions(dimensions) {
    const { width, height } = dimensions;
    TilesDimensions.MAX_WIDTH = Math.max(TilesDimensions.MAX_WIDTH, width);
    TilesDimensions.MAX_HEIGHT = Math.max(TilesDimensions.MAX_HEIGHT, height);
    TilesDimensions.H_TO_W_RATIO = TilesDimensions.MAX_WIDTH / TilesDimensions.MAX_HEIGHT;
    TilesDimensions.W_TO_H_RATIO = TilesDimensions.MAX_HEIGHT / TilesDimensions.MAX_WIDTH;
}

// FIXME this path needs to be relative to the get-animation-tiles file
const TILE_TEMPLATE = `./zombie/male/${Placeholders.ANIMATION} (${Placeholders.TILE_INDEX}).png`;

export const State = {
    WALK: "WALK",
    ATTACK: "ATTACK",
    IDLE: "IDLE"
};

export const Tiles = {
    [State.WALK]: getAnimationTiles(TILE_TEMPLATE, "Walk", 10, true, handleTileDimensions),
    [State.ATTACK]: getAnimationTiles(TILE_TEMPLATE, "Attack", 8, true, handleTileDimensions),
    [State.IDLE]: getAnimationTiles(TILE_TEMPLATE, "Idle", 15, true, handleTileDimensions)
};
