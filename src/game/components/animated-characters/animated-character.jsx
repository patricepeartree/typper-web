import React, { useState, useEffect, forwardRef } from "react";

import { useSimpleTileAnimation } from "@custom-hooks";


const TIME_BETWEEN_TILES = 100;

function AnimatedCharacter(props, ref) {
    const { id, character, state, invert } = props;

    const [activeTiles, setActiveTiles] = useState([]);

    useEffect(() => {
        setActiveTiles(character.Tiles[state] || []);
    }, [character, state]);

    const tileSrc = useSimpleTileAnimation(activeTiles, TIME_BETWEEN_TILES);

    return (
        <img alt="" id={id} ref={ref} src={tileSrc} style={{
            height: "100%",
            transform: invert ? "scaleX(-1)" : ""
        }} />
    );
}

export default forwardRef(AnimatedCharacter);
