const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3010 });

let leaderboard = [];

wss.on('connection', (ws) => {

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'username') {
            leaderboard.push({
                'username': data.username,
                'score': 0
            });
            console.log(`Received username: ${data.username}`);
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
        leaderboard: leaderboard, // e.g., ['Alice', 'Bob', ...]
    });

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}

console.log('WebSocket server running on ws://localhost:3010');
