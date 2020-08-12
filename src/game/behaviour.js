import { MaleZombie } from "../assets/zombie";
import { ENEMY_TO_WINDOW_HEIGHT_RATIO, SPAWNABLE_AREA_LEFT_ADJUSTMENT, SHOT_VELOCITY } from "./constants";

export function moveMissile(missile, deltaT) {
    const { x, y, sin, cos } = missile;
    const deltaH = SHOT_VELOCITY * (deltaT / 1000);
    const deltaX = cos * deltaH;
    const deltaY = sin * deltaH;
    return {
        x: x + deltaX,
        y: y + deltaY
    };
}

export function calculateEnemyShootPosition(elem, rightSideOfTheScreen) {
    const { width, height, right, bottom } = elem.getBoundingClientRect();
    const negativeOffsetX = width * (rightSideOfTheScreen ? 1 - 0.35 : 0.35);
    const negativeOffsetY = height * 0.40;
    return {
        x: right - negativeOffsetX,
        y: bottom - negativeOffsetY
    };
}

export function getRandomLaneForEnemy() {
    const { H_TO_W_RATIO } = MaleZombie.TilesDimensions;
    const widthPercentage = ENEMY_TO_WINDOW_HEIGHT_RATIO * H_TO_W_RATIO * 100;
    const spawnableArea = 100 - widthPercentage - SPAWNABLE_AREA_LEFT_ADJUSTMENT;
    const laneInSpawnableArea = Math.random() * spawnableArea;
    return SPAWNABLE_AREA_LEFT_ADJUSTMENT + laneInSpawnableArea;
}
