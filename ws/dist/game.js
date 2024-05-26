"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "White",
            },
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "Black",
            },
        }));
    }
    handleMove(socket, move) {
        try {
            this.board.move(move);
        }
        catch (error) {
            return;
        }
        if (this.board.isGameOver()) {
            this.player1.emit(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "White",
                },
            }));
            return;
        }
        if (this.board.moves.length % 2 == 0) {
            this.player2.emit(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
    }
}
exports.Game = Game;
