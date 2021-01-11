import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { Router } from "react-router";
import { createMemoryHistory } from "history";

import MainMenu from "@game/pages/main-menu/main-menu";
import ResetGame from "@game/pages/reset-game";
import Game from "@game/pages/game";
import GameOver from "@game/pages/game-over";

import { authenticate } from "@game/game-service";
import { setAuthenticated } from "@game/store/actions";

import { Routes } from "@game/constants";

import "./App.css";

const history = createMemoryHistory();

// import logo from './logo.svg';

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        authenticate().then(() => {
            dispatch(setAuthenticated(true));
        });
    }, [dispatch]);

    return (
        <Router history={history}>
            <Switch>
                <Route path={Routes.RESET_GAME}>
                    <ResetGame />
                </Route>
                <Route path={Routes.PLAY}>
                    <Game />
                </Route>
                <Route path={Routes.GAME_OVER}>
                    <GameOver />
                </Route>
                <Route path={Routes.MAIN_MENU} >
                    <MainMenu />
                </Route>
            </Switch>
        </Router >
    );
}

export default App;
