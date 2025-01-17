const WebSocket = require('ws');
const fs = require('fs');

const wss = new WebSocket.Server({ port: 3010 });

function loadFlagLinks(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n').map(line => line.trim()).filter(Boolean);

    const flagMap = {};
    lines.forEach(line => {
        const commas = line.split(',');
        flagMap[commas[0]] = commas.slice(1);
    });

    return flagMap;
}

function shuffleHashMap(hashMap) {
    const entries = Object.entries(hashMap);
    for (let i = entries.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [entries[i], entries[j]] = [entries[j], entries[i]];
    }
    const shuffledMap = {};
    for (const [key, value] of entries) {
        shuffledMap[key] = value;
    }
    return shuffledMap;
}


flagMap = loadFlagLinks('flaglinks.txt');
shuffled = shuffleHashMap(flagMap);

let leaderboard = {};

wss.on('connection', (ws) => {

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'username') {
            if(!data.username) return;
            leaderboard[data.username] = 0;
            console.log(`Received username: ${data.username}`);
            broadcastLeaderboard();
        }

        if (data.type === 'leaderboard') {
            leaderboard = data.leaderboard;
            broadcastLeaderboard();
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected.');
    });
});

function broadcastLeaderboard() {
    const payload = JSON.stringify({
        type: 'leaderboard',
        leaderboard: leaderboard,
        orderFlags: shuffled,
    });

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}

console.log('WebSocket server running on ws://localhost:3010');
