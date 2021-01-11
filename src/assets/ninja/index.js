import getAnimationTiles, { Placeholders } from "@assets/get-animation-tiles";

// FIXME this path needs to be relative to the get-animation-tiles file
const TILE_TEMPLATE = `./ninja/${Placeholders.ANIMATION}__00${Placeholders.TILE_INDEX}.png`;

export const State = {
    IDLE: "IDLE"
};

export const Tiles = {
    [State.IDLE]: getAnimationTiles(TILE_TEMPLATE, "Idle", 10)
};
