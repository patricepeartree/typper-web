// import { combineReducers } from 'redux';
// import metaReducer from "./testruns-list-meta-reducer";
// import reportReducer from "./testruns-list-report-reducer";
// import dataReducer from "./testruns-list-data-reducer";
// export default combineReducers({ report: reportReducer, meta: metaReducer, data: dataReducer });

import randomWords from "random-words";

import { HERO_LIFE, SHOT_DAMAGE } from "@game/constants";

import {
    SAVE_PLAYER_NAME,
    RESET_GAME,
    SET_GAME_IS_PAUSED,
    SPAWN_ENEMY,
    SET_CLOSEST_ENEMY,
    PLAYER_TYPED,
    ENEMY_SHOOT,
    UPDATE_HERO_POSITION,
    INFLICT_DAMAGE,
    ENEMY_UNMOUNTED_AT,
    SET_AUTHENTICATED
} from "../action-types";

import { getRandomLaneForEnemy } from "@game/behaviour";

import { logGameOver } from "../../../firebase-events";


const initialState = {
    authenticated: false,
    playerName: null,
    gameIsReady: true,
    gameIsPaused: false,
    gameOver: false,
    enemies: [],
    enemyByFirstLetter: {},
    lockedEnemy: null,
    lockedWord: null,
    nextIndex: null,
    enemyShots: [],
    heroPosition: null,
    heroLife: HERO_LIFE,
    score: 0,
    tempKilledEnemiesScores: {}, // waiting for unmount position
    killedEnemiesScores: [],
    killedEnemies: new Set() // this is always the same Set
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: action.payload
            };

        case SAVE_PLAYER_NAME:
            return {
                ...state,
                playerName: action.payload
            };

        case RESET_GAME:
            return {
                ...initialState,
                authenticated: state.authenticated,
                playerName: state.playerName
            };

        case SET_GAME_IS_PAUSED:
            return {
                ...state,
                gameIsPaused: action.payload
            };

        case SPAWN_ENEMY: {
            if (state.gameOver) {
                return state;
            }

            const id = new Date().getTime().toString();
            const lane = getRandomLaneForEnemy();
            const word = randomWords();

            const enemies = [...state.enemies, {
                id,
                lane,
                word
            }];

            const enemyByFirstLetter = state.enemyByFirstLetter[word[0]] ? state.enemyByFirstLetter : {
                ...state.enemyByFirstLetter,
                [word[0]]: {
                    id
                }
            };

            return {
                ...state,
                enemies,
                enemyByFirstLetter
            };
        }

        case SET_CLOSEST_ENEMY: {
            const { id, posY, word } = action.payload;
            if (id === state.lockedEnemy || state.killedEnemies.has(id)) {
                break;
            }
            const enemyByFirstLetter = {
                ...state.enemyByFirstLetter,
                [word[0]]: {
                    id,
                    posY
                }
            };
            return { ...state, enemyByFirstLetter };
        }

        case PLAYER_TYPED: {
            if (!state.lockedEnemy) {
                const enemyIdAndPosY = state.enemyByFirstLetter[action.payload];
                if (!enemyIdAndPosY) {
                    // no enemy for typed letter
                    break;
                }

                const { id } = enemyIdAndPosY;
                const enemy = state.enemies.find(e => e.id === id);

                const { [action.payload]: _, ...enemyByFirstLetter } = state.enemyByFirstLetter;

                return {
                    ...state,
                    lockedEnemy: id,
                    lockedWord: enemy.word,
                    nextIndex: 1,
                    enemyByFirstLetter
                };
            }

            const nextLetter = state.lockedWord[state.nextIndex];
            if (nextLetter === action.payload) {
                const nextIndex = state.nextIndex + 1;
                if (nextIndex < state.lockedWord.length) {
                    return { ...state, nextIndex };
                }

                // enemy dies
                const enemies = [...state.enemies];
                const enemyIndex = enemies.findIndex(e => e.id === state.lockedEnemy);
                enemies.splice(enemyIndex, 1);

                const enemyScore = state.lockedWord.length * 10;

                const score = state.score + enemyScore;

                const tempKilledEnemiesScores = {
                    ...state.tempKilledEnemiesScores,
                    [state.lockedEnemy]: enemyScore
                };

                state.killedEnemies.add(state.lockedEnemy);

                return {
                    ...state,
                    enemies,
                    lockedEnemy: null,
                    lockedWord: null,
                    nextIndex: null,
                    score,
                    tempKilledEnemiesScores
                }
            }
            break;
        }

        case ENEMY_SHOOT: {
            const { enemyId, x, y } = action.payload;
            const { x: heroPosX, y: heroPosY } = state.heroPosition;
            const angle = Math.atan2(heroPosY - y, heroPosX - x);

            const enemyShots = [...state.enemyShots, {
                id: `${enemyId}-${new Date().getTime().toString()}`,
                damage: SHOT_DAMAGE,
                x,
                y,
                sin: Math.sin(angle),
                cos: Math.cos(angle),
                isFromLockedEnemy: enemyId === state.lockedEnemy
            }];

            return { ...state, enemyShots };
        }

        case UPDATE_HERO_POSITION:
            return {
                ...state,
                heroPosition: action.payload
            };

        case INFLICT_DAMAGE: {
            const enemyShots = [...state.enemyShots];
            const shotIndex = enemyShots.findIndex(shot => shot.id === action.payload);
            const [shot] = enemyShots.splice(shotIndex, 1);
            const heroLife = state.heroLife - shot.damage;

            if (heroLife <= 0) {
                logGameOver(state.killedEnemies.size);

                return {
                    ...state,
                    gameIsReady: false,
                    gameOver: true,
                    heroLife: 0
                };
            }

            return {
                ...state,
                enemyShots,
                heroLife
            };
        }

        case ENEMY_UNMOUNTED_AT: {
            const { enemyId, x, y } = action.payload;

            const { [enemyId]: enemyScore, ...tempKilledEnemiesScores } = state.tempKilledEnemiesScores;
            if (!enemyScore) {
                break;
            }

            const killedEnemiesScores = [...state.killedEnemiesScores, {
                score: enemyScore,
                position: {
                    x,
                    y
                }
            }];

            return {
                ...state,
                tempKilledEnemiesScores,
                killedEnemiesScores
            };
        }

        default:
            break;
    }
    return state;
};

export default rootReducer;
