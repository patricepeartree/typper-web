const Events = Object.freeze({
    GAME_START: "game_start",
    GAME_OVER: "game_over"
});

const EventParams = Object.freeze({
    KILL_COUNT: "kill_count"
});

export function logGameStart() {
    logEvent(Events.GAME_START);
}

export function logGameOver(killCount) {
    logEvent(Events.GAME_OVER, {
        [EventParams.KILL_COUNT]: killCount
    });
}

function logEvent(eventName, eventParams) {
    if (window.firebase) {
        const analytics = window.firebase.analytics();
        if (analytics) {
            analytics.logEvent(eventName, eventParams);
        }
    }
}
