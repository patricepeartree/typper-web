import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { spawnEnemy, playerTyped, setGameIsPaused } from './store/actions';
import { useWindowVisibility } from "../custom-hooks";

import ShootZone from './components/shoot-zone';
import Snot from './components/snot';
import Ninja from './components/characters/hero/ninja';
import Zombie from './components/characters/enemy/zombie';

import Grass from '../assets/grass_cropped.png';
import { ENEMY_SPAWN_INTERVAL, ZIndexes } from './constants';


function Game() {
    const enemies = useSelector(state => state.enemies);
    const enemyShots = useSelector(state => state.enemyShots);
    const gameIsPaused = useSelector(state => state.gameIsPaused);
    const gameOver = useSelector(state => state.gameOver);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!gameIsPaused && !gameOver) {
            const intervalId = setInterval(() => {
                dispatch(spawnEnemy());
            }, ENEMY_SPAWN_INTERVAL);
            return () => clearInterval(intervalId);
        }
    }, [dispatch, gameIsPaused, gameOver]); // XXX: redux guarantees that dispatch does not change between renders, but necessary for missing dependencies warning

    function handleKeyPress({ key }) {
        dispatch(playerTyped(key.toLowerCase()));
    }

    useEffect(() => {
        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    function handleWindowVisibilityChange(isHidden) {
        if (!isHidden) {
            setTimeout(() => {
                dispatch(setGameIsPaused(isHidden));
            }, 500);
        } else {
            dispatch(setGameIsPaused(isHidden));
        }
    }

    const memoizedHandleWindowVisibilityChange = useCallback(handleWindowVisibilityChange, []);
    useWindowVisibility(memoizedHandleWindowVisibilityChange);

    return (
        <React.Fragment>
            <Background />
            {enemyShots.map(({ id, x, y, sin, cos, isFromLockedEnemy }) =>
                <Snot
                    key={id}
                    id={id}
                    initialPosX={x}
                    initialPosY={y}
                    sin={sin}
                    cos={cos}
                    isFromLockedEnemy={isFromLockedEnemy}
                />
            )}
            {enemies.map(({ id, lane, word }) =>
                <Zombie
                    key={id}
                    id={id}
                    lane={lane}
                    word={word}
                />
            )}
            <ShootZone></ShootZone>
            <Ninja />
            {gameOver && <GameOverCover />}
        </React.Fragment>
    );
}

const Background = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: url(${Grass});
    background-size: 250px;
`;

const GameOverCover = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: red;
    opacity: 0.5;
    z-index: ${ZIndexes.GAME_OVER};  
`;

export default Game;
