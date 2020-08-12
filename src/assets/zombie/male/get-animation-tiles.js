const ANIMATION_PLACEHOLDER = "#ANIMATION#";
const TILE_INDEX_PLACEHOLDER = '#INDEX';
const IDLE_TILE_TEMPLATE = `./${ANIMATION_PLACEHOLDER} (${TILE_INDEX_PLACEHOLDER}).png`;

export default function getAnimationTiles(animation, numberTiles, dimensionsCallback = () => { }) {
    return Array(numberTiles).fill(null).map((_, i) => {
        const tileSrc = IDLE_TILE_TEMPLATE.replace(ANIMATION_PLACEHOLDER, animation)
            .replace(TILE_INDEX_PLACEHOLDER, i + 1);

        const tile = require(`${tileSrc}`);

        if (dimensionsCallback) {
            const img = new Image();
            img.onload = (ev) => {
                dimensionsCallback({
                    width: img.naturalWidth,
                    height: img.naturalHeight
                });
            }
            img.src = tile;
        }

        return tile;
    });
}
