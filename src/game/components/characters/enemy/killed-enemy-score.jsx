import React from "react";
import styled, { keyframes } from "styled-components";

import { ZIndexes } from "@game/constants";

const ANIMATION_TIME = 1000; // in ms


function KilledEnemyScore(props) {
    const { score, position } = props;

    return <Score position={position}><PlusSign />{score}</Score>;
}


const animation = (top) => keyframes`
    0% {
        top: ${top}px;
        opacity: 1;
    }
    100% {
        top: ${top - 50}px;
        opacity: 0;
    }
`;

const Score = styled.span`
    position: absolute;
    left: ${props => props.position.x}px;
    font-family: Zombie;
    color: #ffdd00;
    text-shadow: -3px 0 black, 0 3px black, 3px 0 black, 0 -3px black;
    font-size: 50px;
    animation: ${props => animation(props.position.y)} ${ANIMATION_TIME}ms ease-out;
    opacity: 0;
    z-index: ${ZIndexes.KILLED_ENEMY_SCORE};
`;

const PlusSign = styled.span`
    font-weight: bold;

    &:before {
        content: "+";
    }
`;

export default KilledEnemyScore;
