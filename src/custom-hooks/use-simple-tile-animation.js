import { useState, useCallback, useEffect } from 'react';

import { useAnimationFrame } from './index';

function useSimpleTileAnimation(tiles, timeBetweenTiles) {
    const [tileIndex, setTileIndex] = useState(0);

    let timeToNextTile = timeBetweenTiles;

    function animateTiles(deltaT) {
        timeToNextTile -= deltaT;
        if (timeToNextTile <= 0) {
            setTileIndex(prevTileIndex => prevTileIndex < tiles.length - 1 ? prevTileIndex + 1 : 0);
            timeToNextTile = timeBetweenTiles;
        }
    }

    const memoizedAnimateTiles = useCallback(animateTiles, [tiles]);
    useAnimationFrame(memoizedAnimateTiles);

    // reset index if tiles array changes
    useEffect(() => {
        setTileIndex(0);
    }, [tiles]);

    return tiles[tileIndex];
}

export default useSimpleTileAnimation;
