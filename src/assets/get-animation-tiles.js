export const Placeholders = Object.freeze({
    ANIMATION: "#ANIMATION#",
    TILE_INDEX: "#INDEX"
});


export default function getAnimationTiles(tileSrcTemplate, animation, numberTiles, indexStartsAtOne = false, dimensionsCallback = () => { }) {
    return Array(numberTiles).fill(null).map((_, i) => {
        const indexOffset = indexStartsAtOne ? 1 : 0;

        const tileSrc = tileSrcTemplate.replace(Placeholders.ANIMATION, animation)
            .replace(Placeholders.TILE_INDEX, i + indexOffset);

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
