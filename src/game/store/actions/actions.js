import {
    SET_AUTHENTICATED,
    SAVE_PLAYER_NAME,
    RESET_GAME,
    SET_GAME_IS_PAUSED,
    SPAWN_ENEMY,
    SET_CLOSEST_ENEMY,
    PLAYER_TYPED,
    ENEMY_SHOOT,
    UPDATE_HERO_POSITION,
    INFLICT_DAMAGE,
    ENEMY_UNMOUNTED_AT
} from "../action-types";

export function setAuthenticated(authenticated) {
    return { type: SET_AUTHENTICATED, payload: authenticated };
}

export function savePlayerName(name) {
    return { type: SAVE_PLAYER_NAME, payload: name };;
}

export function resetGame() {
    return { type: RESET_GAME };
}

export function setGameIsPaused(gameIsPaused) {
    return { type: SET_GAME_IS_PAUSED, payload: gameIsPaused };
}

export function spawnEnemy() {
    return { type: SPAWN_ENEMY };
};

export function setClosestEnemy(id, posY, word) {
    return {
        type: SET_CLOSEST_ENEMY,
        payload: {
            id,
            posY,
            word
        }
    };
}

export function playerTyped(key) {
    return { type: PLAYER_TYPED, payload: key };
}

export function enemyShoot(enemyId, x, y) {
    return {
        type: ENEMY_SHOOT, payload: {
            enemyId,
            x,
            y
        }
    };
}

export function updateHeroPosition(x, y) {
    return {
        type: UPDATE_HERO_POSITION, payload: {
            x,
            y
        }
    };
}

export function inflictDamage(shotId) {
    return { type: INFLICT_DAMAGE, payload: shotId };
}

export function enemyUnmountedAt(enemyId, x, y) {
    return {
        type: ENEMY_UNMOUNTED_AT, payload: {
            enemyId,
            x,
            y
        }
    };
}
