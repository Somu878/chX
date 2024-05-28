import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private moves: string[];
  private startTime: Date;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.moves = [];
    this.startTime = new Date();
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "White",
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "Black",
        },
      })
    );
  }

  handleMove(socket: WebSocket, move: { from: string; to: string }) {
    try {
      const result = this.board.move(move);
      if (!result) {
        throw new Error("Invalid move");
      }
    } catch (error) {
      console.log("Error making move:", error);
      return;
    }

    this.moves.push(`${move.from}-${move.to}`);

    const movePayload = JSON.stringify({
      type: MOVE,
      payload: move,
    });

    if (this.board.isGameOver()) {
      const winner = this.board.turn() === "w" ? "black" : "white";
      const gameOverPayload = JSON.stringify({
        type: GAME_OVER,
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
    } else {
      this.player1.send(movePayload);
    }
  }
}
