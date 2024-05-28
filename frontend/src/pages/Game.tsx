import { useEffect, useState } from "react";
import ChessBoard from "../components/ChessBoard";
import useSocket from "../hooks/useSocket";
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
import { Chess } from "chess.js";

function Game() {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [turn, setTurn] = useState<"w" | "b">(chess.turn());
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      switch (message.type) {
        case INIT_GAME:
          const newChess = new Chess();
          setChess(newChess);
          setBoard(newChess.board());
          setTurn(newChess.turn());
          break;
        case MOVE:
          chess.move(message.payload);
          setBoard(chess.board());
          setTurn(chess.turn());
          break;
        case GAME_OVER:
          console.log("Game over");
          break;
        default:
          console.log("Unknown message type:", message.type);
      }
    };
    return () => {
      if (socket) {
        socket.onmessage = null;
      }
    };
  }, [socket]);

  const intializeGame = () => {
    socket?.send(
      JSON.stringify({
        type: INIT_GAME,
      })
    );
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-screen-lg pt-8 ">
        <div className="flex flex-col justify-between w-full md:flex-row">
          <div className="flex justify-center w-5/6 p-8">
            <ChessBoard
              socket={socket}
              board={board}
              setBoard={setBoard}
              chess={chess}
            />
          </div>
          <div className="flex flex-col items-center justify-center w-full h-full align-middle">
            <button
              className="mt-32 w-28 btn btn-warning"
              onClick={intializeGame}
            >
              Play
            </button>
            <div className="mt-4 text-lg">
              {turn === "w" ? "White's Turn" : "Black's Turn"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
