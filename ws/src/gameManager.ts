import { Game } from "./game";
import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";

export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private users: WebSocket[];

  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);

    this.handleMessage(socket);
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter((s) => s !== socket);
  }

  private handleMessage(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === INIT_GAME) {
        if (this.pendingUser) {
          const game = new Game(this.pendingUser, socket);
          console.log("Game initialized");
          this.pendingUser = null;
          this.games.push(game);
        } else {
          this.pendingUser = socket;
          console.log("In pending mode");
        }
      }
      if (message.type === MOVE) {
        const game = this.games.find(
          (g) => g.player1 === socket || g.player2 === socket
        );
        if (game) {
          game.handleMove(socket, message.move);
        }
      }
    });
  }
}
