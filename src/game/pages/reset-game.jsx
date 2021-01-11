import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";

import { Routes } from "@game/constants";
import { resetGame } from "@game/store/actions";

function ResetGame() {
    const gameIsReady = useSelector(state => state.gameIsReady);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(resetGame());
    }, [dispatch]);

    if (gameIsReady) {
        return <Redirect to={Routes.PLAY} />;
    }

    return null;
}

export default ResetGame;
