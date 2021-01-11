import React, { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';

import { useAnimationFrame, useCollisionDetection, useHeightBasedOnWindow } from "@custom-hooks";
import { inflictDamage } from '@game/store/actions';
import { moveShot } from "@game/behaviour";

import { ZIndexes } from "@game/constants";

import SnotImage from "@assets/snot.png";


function Snot(props) {
    const { id, initialPosX, initialPosY, sin, cos, isFromLockedEnemy } = props;

    const gameIsPaused = useSelector(state => state.gameIsPaused);
    const dispatch = useDispatch();

    const [position, setPosition] = useState({
        x: initialPosX,
        y: initialPosY
    });

    const height = useHeightBasedOnWindow(0.07);

    const elemRef = useRef();

    function move(deltaT) {
        setPosition(previousPos => {
            const shot = {
                x: previousPos.x,
                y: previousPos.y,
                sin,
                cos
            };
            const { x, y } = moveShot(shot, deltaT);
            return { x, y };
        });
    }

    const memoizedMove = useCallback(move, []);
    const cancelAnimationFrame = useAnimationFrame(memoizedMove, gameIsPaused);

    function hitHero() {
        cancelAnimationFrame();
        dispatch(inflictDamage(id));
    }
    useCollisionDetection(elemRef, "hero", hitHero);

    return (
        <Image
            ref={elemRef}
            src={SnotImage}
            position={position}
            height={height}
            isFromLockedEnemy={isFromLockedEnemy}
        />
    );
}

const animation = keyframes`
    0% {
        transform: scale(1.0);
    }
    100% {
        transform: scale(0.8);
    }
`;

const Image = styled.img.attrs(props => ({
    style: {
        height: `${props.height}px`,
        top: props.position.y,
        left: props.position.x,
        zIndex: props.isFromLockedEnemy ? ZIndexes.LOCKED_ENEMY_SHOT : ZIndexes.SHOT
    },
}))`
    position: absolute;
    animation: ${animation} 700ms ease-in-out infinite alternate;
`;

export default Snot;
