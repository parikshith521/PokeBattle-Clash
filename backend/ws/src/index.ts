import { WebSocketServer } from 'ws';
import { BattleManager } from './battleManager';

const wss = new WebSocketServer({ port: 8080 });

const battleManager:BattleManager = new BattleManager();

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