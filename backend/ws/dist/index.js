"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const battleManager_1 = require("./battleManager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const battleManager = new battleManager_1.BattleManager();
wss.on('connection', function connection(ws) {
    battleManager.addUser(ws);
    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });
    ws.on("disconnect", () => battleManager.removeUser(ws));
    ws.send(JSON.stringify({
        payload: ws
    }));
});
