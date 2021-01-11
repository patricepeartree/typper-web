import React, { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Redirect } from "react-router-dom";

import { useWindowVisibility } from "@custom-hooks";

import { ENEMY_SPAWN_INTERVAL, Routes } from "@game/constants";

import { spawnEnemy, playerTyped, setGameIsPaused } from "@game/store/actions";

import { BlurredOverlay } from "@game/components/util/styled-components";
import Countdown from "@game/components/countdown";
import ShootZone from "@game/components/shoot-zone";
import Snot from "@game/components/snot";
import Ninja from "@game/components/characters/hero/ninja";
import HeroHealthBar from "@game/components/characters/hero/hero-health-bar";
import Zombie from "@game/components/characters/enemy/zombie";
import KilledEnemyScore from "@game/components/characters/enemy/killed-enemy-score";

import Grass from "@assets/grass_cropped.png";


function Game() {
    const enemies = useSelector(state => state.enemies);
    const enemyShots = useSelector(state => state.enemyShots);
    const gameIsPaused = useSelector(state => state.gameIsPaused);
    const gameOver = useSelector(state => state.gameOver);
    const score = useSelector(state => state.score);
    const killedEnemiesScores = useSelector(state => state.killedEnemiesScores);
    const dispatch = useDispatch();

    const [isInCountdown, setIsInCountdown] = useState(true);

    useEffect(() => {
        if (!isInCountdown && !gameIsPaused) {
            const intervalId = setInterval(() => {
                dispatch(spawnEnemy());
            }, ENEMY_SPAWN_INTERVAL);
            return () => clearInterval(intervalId);
        }
    }, [dispatch, isInCountdown, gameIsPaused]); // XXX: redux guarantees that dispatch does not change between renders, but necessary for missing dependencies warning

    function handleKeyPress({ key }) {
        dispatch(playerTyped(key.toLowerCase()));
    }

    useEffect(() => {
        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // FIXME clearTimeout
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

    if (gameOver) {
        return <Redirect to={Routes.GAME_OVER} />;
    }

    return (
        <>
            {killedEnemiesScores.map(({ score, position }) =>
                <KilledEnemyScore
                    key={`${score}-${position.x}-${position.y}`}
                    score={score}
                    position={position}
                />
            )}
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
            <Score>{`Score: ${score}`}</Score>
            <PositionedHeroHealthBar />
            {isInCountdown && (
                <BlurredOverlay>
                    <Countdown isPaused={gameIsPaused} onFinish={() => setIsInCountdown(false)} />
                </BlurredOverlay>
            )}
        </>
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

const Score = styled.span`
    position: absolute;
    bottom: 0;
    left: 25%;
    transform: translateX(-50%);
    font-family: Zombie;
    font-size: 36px;    
    color: white;
    text-shadow: 4px 4px black;
`;

const PositionedHeroHealthBar = styled(HeroHealthBar)`
    position: absolute;
    bottom: 10px;
    left: 75%;
    transform: translateX(-50%);
    width: 180px;
    height: 23px;
`;

export default Game;
