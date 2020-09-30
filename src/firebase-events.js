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
    try {
        window.firebase.analytics().logEvent(eventName, eventParams);
    } catch (e) {
        console.warn("Unable to log event to Firebase Analytics:", e);
    }
}
