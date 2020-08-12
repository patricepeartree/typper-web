// import { combineReducers } from 'redux';
// import metaReducer from "./testruns-list-meta-reducer";
// import reportReducer from "./testruns-list-report-reducer";
// import dataReducer from "./testruns-list-data-reducer";
// export default combineReducers({ report: reportReducer, meta: metaReducer, data: dataReducer });

import randomWords from "random-words";

import { HERO_LIFE, SHOT_DAMAGE } from "../../constants/game-constants";

import {
    SET_GAME_IS_PAUSED,
    SPAWN_ENEMY,
    SET_CLOSEST_ENEMY,
    PLAYER_TYPED,
    ENEMY_SHOOT,
    UPDATE_HERO_POSITION,
    INFLICT_DAMAGE
} from "../action-types";

import { getRandomLaneForEnemy } from "../../behaviour";


const initialState = {
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
    killedEnemies: new Set() // this is always the same Set
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case SET_GAME_IS_PAUSED:
            return {
                ...state,
                gameIsPaused: action.payload
            };

        case SPAWN_ENEMY: {
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

                state.killedEnemies.add(state.lockedEnemy);

                return {
                    ...state,
                    enemies,
                    lockedEnemy: null,
                    lockedWord: null,
                    nextIndex: null
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
                cos: Math.cos(angle)
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
                return {
                    ...initialState,
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

        default:
            break;
    }
    return state;
};

export default rootReducer;
