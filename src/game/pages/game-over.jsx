import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import styled from "styled-components";

import DeadNinja from "@assets/ninja/Dead__009.png";

import { useKeyDownHandlers } from "@custom-hooks";

import { Routes, Keys, AlwaysFocusedConstants } from "@game/constants";
import { possiblyUpdateLeaderboard, setNameForLeaderboardEntry } from "@game/game-service";
import { savePlayerName } from "@game/store/actions";

import { FullScreenContainer } from "@game/components/util/styled-components";
import { AlwaysFocusedContextProvider } from "@game/components/util/always-focused-context";
import Leaderboard from "@game/components/leaderboard";
import GenericBackground, { ZIndexes as GenericBackgroundXZIndexes } from "@game/components/generic-background";


const ZIndexes = {
    DEAD_NINJA: GenericBackgroundXZIndexes.CHARACTERS,
    RED_OVERLAY: GenericBackgroundXZIndexes.LAST_BACKGROUND_LAYER + 1,
    CONTENT: GenericBackgroundXZIndexes.LAST_BACKGROUND_LAYER + 2
};

const NavigationInfo = {
    NORMAL: ["SPACE = Play Again", "ESC = Back to Main Menu"],
    WAITING_FOR_NAME: ["ENTER = Submit"]
};


function GameOver() {
    const score = useSelector(state => state.score);
    const playerName = useSelector(state => state.playerName);
    const dispatch = useDispatch();

    const [keyHandlers, setKeyHandlers] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [leaderboard, setLeaderboard] = useState();
    const [idToRequestName, setIdToRequestName] = useState();
    const [redirectToRoute, setRedirectToRoute] = useState();

    // score doesn't need to be in the dependencies array because we only want to execute once, on mount
    useEffect(() => {
        possiblyUpdateLeaderboard(score).then((result) => {
            setLeaderboard(result.leaderboard);
            setIdToRequestName(result.idToRequestName);
            setIsLoading(false);
        }).catch(err => {
            console.error("Error updating leaderboard:", err);
            setError(true);
            setIsLoading(false);
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    function handleNameSubmit(name) {
        if (isLoading) {
            return;
        }

        setIsLoading(true);

        setNameForLeaderboardEntry(idToRequestName, name).then((finalName) => {
            const index = leaderboard.findIndex(entry => entry.id === idToRequestName);

            if (index !== -1) {
                const updatedLeaderboard = [...leaderboard];
                updatedLeaderboard[index] = {
                    ...updatedLeaderboard[index],
                    name: finalName
                };

                setLeaderboard(updatedLeaderboard);
            }

            setIdToRequestName(null);
            setIsLoading(false);
            dispatch(savePlayerName(finalName));
        }).catch(err => {
            console.error("Error setting name for leaderboard entry:", err);
            setError(true);
            setIsLoading(false);
        });
    }

    useEffect(() => {
        setKeyHandlers(idToRequestName != null ? null : {
            [Keys.SPACE]: () => setRedirectToRoute(Routes.RESET_GAME),
            [Keys.ESC]: () => setRedirectToRoute(Routes.MAIN_MENU)
        });
    }, [idToRequestName]);

    useKeyDownHandlers(keyHandlers);

    if (redirectToRoute) {
        return <Redirect to={redirectToRoute} />;
    }

    let navigationInfo;
    if (!isLoading) {
        navigationInfo = idToRequestName != null ? NavigationInfo.WAITING_FOR_NAME : NavigationInfo.NORMAL;
    }

    return (
        <AlwaysFocusedContextProvider value={AlwaysFocusedConstants.RouteElemHierarchy[Routes.GAME_OVER]}>
            <GenericBackground navigationInfo={navigationInfo}>
                <PositionedDeadNinja src={DeadNinja} />
                <RedOverlay />
                <ContentContainer>
                    <TitleContainer>
                        <Title>Game Over</Title>
                        <Score>{`Score: ${score}`}</Score>
                    </TitleContainer>
                    <PositionedLeaderboard
                        isLoading={isLoading}
                        error={error}
                        leaderboard={leaderboard}
                        idToRequestName={idToRequestName}
                        defaultName={playerName}
                        onNameSubmit={handleNameSubmit}
                    />
                </ContentContainer>
            </GenericBackground>
        </AlwaysFocusedContextProvider>
    );
}

const PositionedDeadNinja = styled.img`
    position: absolute;
    bottom: 10%;
    left: 25%;
    transform: translateX(-50%);
    height: 55%;
    z-index: ${ZIndexes.DEAD_NINJA};
`;

const RedOverlay = styled(FullScreenContainer)`
    background-color: red;
    opacity: 0.2;
    z-index: ${ZIndexes.RED_OVERLAY};
`;

const ContentContainer = styled(FullScreenContainer)`
    z-index: ${ZIndexes.CONTENT};
`;

const TitleContainer = styled.div`
    position: absolute;
    top: 30%;
    left: 25%;
    transform: translateX(-50%);
    font-family:  Zombie;
    text-align: center;
`;

const Title = styled.div`
    font-size: 90px;
    color: #af0000;
    text-shadow: -5px 0 white, 0 5px white, 5px 0 white, 0 -5px white;
`;

const Score = styled.div`
    font-size: 60px;
    color: white;
    text-shadow: 4px 4px black;
`;

const PositionedLeaderboard = styled(Leaderboard)`
    position: absolute;
    top: 50%;
    left: 65%;
    transform: translate(-50%, -50%);
    width: 35%;
    height: 50%;
`;

export default GameOver;
