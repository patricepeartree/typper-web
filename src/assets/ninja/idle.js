const TILE_INDEX_PLACEHOLDER = '#INDEX';
const IDLE_TILE_TEMPLATE = `./Idle__00${TILE_INDEX_PLACEHOLDER}.png`;
const NUMBER_IDLE_TILES = 10;

function getIdleTiles() {
    return Array(NUMBER_IDLE_TILES).fill(null).map((_, i) => {
        const tileSrc = IDLE_TILE_TEMPLATE.replace(TILE_INDEX_PLACEHOLDER, i);
        return require(`${tileSrc}`);
    });
}

export default getIdleTiles();
