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
            const result = this.board.move(move);
            if (!result) {
                throw new Error("Invalid move");
            }
        }
        catch (error) {
            console.log("Error making move:", error);
            return;
        }
        this.moves.push(`${move.from}-${move.to}`);
        const movePayload = JSON.stringify({
            type: messages_1.MOVE,
            payload: move,
        });
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === "w" ? "black" : "white";
            const gameOverPayload = JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner,
                },
            });
            this.player1.send(gameOverPayload);
            this.player2.send(gameOverPayload);
            return;
        }
        if (socket === this.player1) {
            this.player2.send(movePayload);
        }
        else {
            this.player1.send(movePayload);
        }
    }
}
exports.Game = Game;
