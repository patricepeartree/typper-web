import {
    SET_GAME_IS_PAUSED,
    SPAWN_ENEMY,
    SET_CLOSEST_ENEMY,
    PLAYER_TYPED,
    ENEMY_SHOOT,
    UPDATE_HERO_POSITION,
    INFLICT_DAMAGE
} from "../action-types";

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

export function inflictDamage(missileId) {
    return { type: INFLICT_DAMAGE, payload: missileId };
}