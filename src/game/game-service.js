import { NUM_LEADERBOARD_ENTRIES } from "@game/constants";

export async function authenticate() {
    try {
        return await window.firebase.auth().signInAnonymously();
    } catch (e) {
        console.error("Error anonymously authenticating user in Firebase:", e);
        throw e;
    }
}

export async function getLeaderboard() {
    const leaderboardRef = getLeaderboardReference();
    const snapshot = await leaderboardRef.once("value");
    return snapshot.val() || [];
}

export async function possiblyUpdateLeaderboard(score) {
    if (!score) {
        return {
            leaderboard: await getLeaderboard()
        };
    }

    const leaderboardRef = getLeaderboardReference();

    const newEntry = {
        id: generateRandomId(),
        score
    };

    const result = await leaderboardRef.transaction((leaderboard) => {
        let finalLeaderboard = leaderboard ? [...leaderboard] : [];

        const index = finalLeaderboard.findIndex(entry => entry.score < newEntry.score);

        if (index !== -1) {
            finalLeaderboard.splice(index, 0, newEntry);
            finalLeaderboard = finalLeaderboard.slice(0, NUM_LEADERBOARD_ENTRIES);
        } else if (finalLeaderboard.length < NUM_LEADERBOARD_ENTRIES) {
            finalLeaderboard.push(newEntry);
        } else {
            return leaderboard;
        }

        return finalLeaderboard;
    });

    const leaderboard = result.snapshot.val();

    const needsToRequestName = leaderboard.some(entry => entry.id === newEntry.id);

    return {
        leaderboard,
        idToRequestName: needsToRequestName ? newEntry.id : undefined
    };
}

export async function setNameForLeaderboardEntry(id, name) {
    const finalName = (name || "").trim().toUpperCase();
    if (!finalName) {
        return;
    }

    const leaderboardRef = getLeaderboardReference();

    await leaderboardRef.transaction((leaderboard) => {
        const finalLeaderboard = leaderboard ? [...leaderboard] : [];

        const index = finalLeaderboard.findIndex(entry => entry.id === id);
        if (index === -1) {
            return leaderboard;
        }

        finalLeaderboard[index] = {
            ...finalLeaderboard[index],
            name: finalName
        };

        return finalLeaderboard;
    });

    return finalName;
}

function getLeaderboardReference() {
    return getDatabase().ref("leaderboard");
}

function generateRandomId() {
    const newObjRef = getDatabase().ref().push();
    return newObjRef.key;
}

function getDatabase() {
    try {
        const database = window.firebase.database();
        if (!database) {
            throw new Error(`window.firebase.database() is ${database}`);
        }
        return database;
    } catch (e) {
        console.error("Error accessing Firebase Realtime Database:", e);
        throw e;
    }
}
