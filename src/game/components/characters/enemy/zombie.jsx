import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import styled from 'styled-components';

import { setClosestEnemy, enemyShoot, enemyUnmountedAt } from '@game/store/actions';
import { useAnimationFrame, useCollisionDetection, useHeightBasedOnWindow } from "@custom-hooks";
import { calculateEnemyShootPosition } from '@game/behaviour';

import AnimatedZombie, { State } from "@game/components/animated-characters/zombie";
import EnemyWord from './enemy-word';

import { ENEMY_VELOCITY, ENEMY_SHOOT_INTERVAL, ZIndexes, ENEMY_TO_WINDOW_HEIGHT_RATIO } from '@game/constants';


const selectClosestEnemyForFirstLetter = createSelector(
    state => state.enemyByFirstLetter,
    (_, word) => word,
    (enemyByFirstLetter, word) => enemyByFirstLetter[word[0]]
);

const selectNextIndex = createSelector(
    state => ({ lockedEnemy: state.lockedEnemy, nextIndex: state.nextIndex }),
    (_, id) => id,
    ({ lockedEnemy, nextIndex }, id) => {
        return lockedEnemy === id ? nextIndex : null
    }
);


function Zombie(props) {
    const { id, lane, word } = props;

    const closestEnemyForLetter = useSelector(state => selectClosestEnemyForFirstLetter(state, word));
    const myNextIndex = useSelector(state => selectNextIndex(state, id));
    const lockedEnemy = useSelector(state => state.lockedEnemy);
    const gameIsPaused = useSelector(state => state.gameIsPaused);
    const dispatch = useDispatch();

    const [posY, setPosY] = useState(0);

    const height = useHeightBasedOnWindow(ENEMY_TO_WINDOW_HEIGHT_RATIO);

    const elemRef = useRef();

    function move(deltaT) {
        const posYOffset = ENEMY_VELOCITY * (deltaT / 1000);
        setPosY(previousPosY => previousPosY + posYOffset);
    };

    const memoizedMove = useCallback(move, []);
    const cancelAnimationFrame = useAnimationFrame(memoizedMove, gameIsPaused);

    const collided = useCollisionDetection(elemRef, "shoot-zone", cancelAnimationFrame);

    function shoot() {
        const { x, y } = calculateEnemyShootPosition(elemRef.current, lane > 50);
        dispatch(enemyShoot(id, x, y));
    }

    useEffect(() => {
        if (collided && !gameIsPaused) {
            const intervalId = setInterval(() => {
                shoot();
            }, ENEMY_SHOOT_INTERVAL);
            return () => clearInterval(intervalId);
        }
    }, [collided, gameIsPaused]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const { posY: closestPosY, id: closestId } = closestEnemyForLetter || {};
        if (closestPosY == undefined || (closestId !== id && closestPosY < posY)) { // eslint-disable-line eqeqeq
            dispatch(setClosestEnemy(id, posY, word));
        }
    }, [dispatch, id, word, closestEnemyForLetter, posY]);

    useEffect(() => {
        const elem = elemRef.current;
        return () => {
            const { top, left } = elem.getBoundingClientRect();
            dispatch(enemyUnmountedAt(id, left, top));
        }
    }, [dispatch, id]);

    return (
        <ZombieContainer
            ref={elemRef}
            height={height}
            lane={lane}
            posY={posY}
            isLockedEnemy={lockedEnemy === id}
        >
            <AnimatedZombie state={State.WALK} invert={lane > 50} />
            <EnemyWordContainer>
                <EnemyWord
                    word={word}
                    nextIndex={myNextIndex}
                    isActive={lockedEnemy === id}
                    isDisabled={lockedEnemy !== null && lockedEnemy !== id}
                />
            </EnemyWordContainer>
        </ZombieContainer>
    );
}

const ZombieContainer = styled.div.attrs(props => ({
    style: {
        height: `${props.height}px`,
        top: props.posY,
        left: `${props.lane}%`,
        zIndex: props.isLockedEnemy ? ZIndexes.LOCKED_ENEMY : ZIndexes.ENEMY
    },
}))`
    position: absolute;
    transform: translateY(-100%);
`;

const EnemyWordContainer = styled.span`
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 100%);
`;

export default Zombie;
