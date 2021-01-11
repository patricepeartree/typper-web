import React from "react";
import styled from "styled-components";

import BackgroundImage from "@assets/Cartoon_Forest_BG_04/Layers/Sky.png";
import BackTreesImage from "@assets/Cartoon_Forest_BG_04/Layers/BG_Decor.png";
import MiddleTreesImage from "@assets/Cartoon_Forest_BG_01/Layers/Middle_Decor.png";
import FrontGrassImage from "@assets/Cartoon_Forest_BG_02/Layers/Ground.png";


const BACKGROUND_LAYERS = [
    { src: BackgroundImage, zIndex: 0 },
    { src: BackTreesImage, zIndex: 1 },
    { src: MiddleTreesImage, zIndex: 2 },
    { src: FrontGrassImage, zIndex: 4 }
];

export const ZIndexes = Object.freeze({
    CHARACTERS: 3,
    LAST_BACKGROUND_LAYER: BACKGROUND_LAYERS[BACKGROUND_LAYERS.length - 1].zIndex,
});


function GenericBackground(props) {
    const { navigationInfo, children } = props;

    return (
        <>
            {BACKGROUND_LAYERS.map(({ src, zIndex }) => <Background key={zIndex} src={src} zIndex={zIndex} />)}
            {children}
            <NavigationInfo>
                {(navigationInfo || []).map(info => <div key={info}>{info}</div>)}
            </NavigationInfo>
        </>
    )
}

const Background = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    z-index: ${props => props.zIndex};
`;

const NavigationInfo = styled.div`
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    color: white;
    opacity: 0.5;
    z-index: ${ZIndexes.LAST_BACKGROUND_LAYER + 1};

    & > div:not(:last-child) {
        padding-right: 30px;
    }
`;

export default GenericBackground;
