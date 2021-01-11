import Routes from "./routes";

const ElemIds = Object.freeze({
    LEADERBOARD: "LEADERBOARD",
    PLAYER_NAME_INPUT: "PLAYER_NAME_INPUT"
});

const RouteElemHierarchy = Object.freeze({
    [Routes.MAIN_MENU]: [
        ElemIds.LEADERBOARD
    ],
    [Routes.GAME_OVER]: [
        ElemIds.PLAYER_NAME_INPUT,
        ElemIds.LEADERBOARD
    ]
});

export default {
    ElemIds,
    RouteElemHierarchy
};
