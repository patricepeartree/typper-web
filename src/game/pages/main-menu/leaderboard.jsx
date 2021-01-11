import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import { getLeaderboard } from "@game/game-service";
import Leaderboard from "@game/components/leaderboard";


function MainMenuLeaderboard() {
    const authenticated = useSelector(state => state.authenticated);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [leaderboard, setLeaderboard] = useState();

    useEffect(() => {
        if (authenticated) {
            getLeaderboard().then(leaderboard => {
                setLeaderboard(leaderboard);
                setIsLoading(false);
            }).catch(err => {
                console.error("Error fetching leaderboard:", err);
                setError(true);
                setIsLoading(false);
            });
        }
    }, [authenticated]);

    return (
        <PositionedLeaderboard
            isLoading={isLoading}
            error={error}
            leaderboard={leaderboard} />
    );
};

const PositionedLeaderboard = styled(Leaderboard)`
    position: absolute;
    top: 35%;
    height: 50%;
    width: 35%;
    left: 50%;
    transform: translateX(-50%);
`;

export default MainMenuLeaderboard;
