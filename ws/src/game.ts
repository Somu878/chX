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
          color: "white",
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
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
    this.player1.send(movePayload);
    this.player2.send(movePayload);
    if (this.board.inCheck()) {
      console.log("CHeck mate");
    }
    if (this.board.isCheckmate()) {
      console.log("Hoho checkmate!");
    }
    if (this.board.isGameOver()) {
      console.log("Game over");
      const winner = this.board.turn() === "w" ? "black" : "white";
      const gameOverPayload = JSON.stringify({
        type: GAME_OVER,
        payload: {
          winner,
        },
      });

      this.player1.send(gameOverPayload);
      this.player2.send(gameOverPayload);
    }
  }
}
