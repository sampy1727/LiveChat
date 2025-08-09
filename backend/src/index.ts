import { WebSocketServer, WebSocket } from 'ws';


const PORT = Number(process.env.PORT) || 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`🚀 ChatPro WebSocket server starting on port ${PORT}...`);

type User = {
    username: string;
    socket: WebSocket;
};

type Room = {
    id: string;
    users: User[];
    chats: string[];
};

const rooms: Room[] = [];

function getRoom(roomId: string): Room | undefined {
    return rooms.find(room => room.id === roomId);
}

function addUserToRoom(roomId: string, user: User) {
    let room = getRoom(roomId);
    if (!room) {
        room = { id: roomId, users: [], chats: [] };
        rooms.push(room);
    }
    room.users.push(user);
}

function broadcastToRoom(roomId: string, message: string) {
    const room = getRoom(roomId);
    if (room) {
        room.users.forEach(u => u.socket.send(message));
    }
}

wss.on('listening', () => {
    console.log(`✅ WebSocket server is listening on ws://localhost:${PORT}`);
});

wss.on('connection', (ws) => {
    console.log('👤 New client connected');
    let currentUser: User | null = null;
    let currentRoomId: string | null = null;

    ws.on('message', (raw) => {
        let msg: any;
        try {
            msg = JSON.parse(raw.toString());
        } catch {
            ws.send(JSON.stringify({ error: 'Invalid JSON' }));
            return;
        }

        if (msg.type === 'auth') {
            try {
                
                const tokenParts = msg.token.split('.');
                if (tokenParts.length === 3) {
                    const payload = JSON.parse(atob(tokenParts[1]));
                    if (payload.username && payload.username.length >= 3) {
                        currentUser = { username: payload.username, socket: ws };
                        ws.send(JSON.stringify({ type: 'auth', success: true }));
                        console.log(`User authenticated: ${payload.username}`);
                    } else {
                        ws.send(JSON.stringify({ type: 'auth', success: false }));
                    }
                } else {
                    ws.send(JSON.stringify({ type: 'auth', success: false }));
                }
            } catch {
                ws.send(JSON.stringify({ type: 'auth', success: false }));
            }
        } else if (msg.type === 'join') {
            if (!currentUser) {
                ws.send(JSON.stringify({ error: 'Not authenticated' }));
                return;
            }
            
            // Remove user from previous room if any
            if (currentRoomId) {
                const oldRoom = getRoom(currentRoomId);
                if (oldRoom) {
                    oldRoom.users = oldRoom.users.filter(u => u.socket !== ws);
                }
            }
            
            currentRoomId = msg.roomId;
            addUserToRoom(msg.roomId, currentUser);
            ws.send(JSON.stringify({ type: 'join', roomId: msg.roomId }));
            console.log(`User ${currentUser.username} joined room: ${msg.roomId}`);
        } else if (msg.type === 'chat') {
            if (!currentUser || !currentRoomId) {
                ws.send(JSON.stringify({ error: 'Join a room first' }));
                return;
            }
            const room = getRoom(currentRoomId);
            if (room) {
                const chatMessage = {
                    type: 'chat',
                    username: currentUser.username,
                    text: msg.text
                };
                room.chats.push(msg.text);
                broadcastToRoom(currentRoomId, JSON.stringify(chatMessage));
                console.log(`Message in ${currentRoomId} from ${currentUser.username}: ${msg.text}`);
            }
        }
    });

    ws.on('close', () => {
        if (currentRoomId && currentUser) {
            const room = getRoom(currentRoomId);
            if (room) {
                room.users = room.users.filter(u => u.socket !== ws);
            }
        }
        console.log(`❌ Client disconnected${currentUser ? ` (${currentUser.username})` : ''}`);
    });
});
