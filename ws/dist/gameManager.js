"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const game_1 = require("./game");
const messages_1 = require("./messages");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.handleMessage(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter((s) => s !== socket);
    }
    handleMessage(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === messages_1.INIT_GAME) {
                if (this.pendingUser) {
                    const game = new game_1.Game(this.pendingUser, socket);
                    console.log("Game initialized");
                    this.pendingUser = null;
                    this.games.push(game);
                }
                else {
                    this.pendingUser = socket;
                    console.log("In pending mode");
                }
            }
            if (message.type === messages_1.MOVE) {
                const game = this.games.find((g) => g.player1 === socket || g.player2 === socket);
                if (game) {
                    game.handleMove(socket, message.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;