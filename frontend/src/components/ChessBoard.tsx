import { PieceSymbol, Square, Color } from "chess.js";
import { useState } from "react";
import { MOVE } from "../pages/Game";

interface BoardProps {
  chess: any;
  setBoard: any;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket | null;
}

function ChessBoard({ board, socket, setBoard, chess }: BoardProps) {
  const [from, setFrom] = useState<null | Square>(null);

  const handleClick = (sqaureRep: Square) => {
    if (!from) {
      setFrom(sqaureRep);
    } else {
      try {
        const move = { from, to: sqaureRep };
        socket?.send(
          JSON.stringify({
            type: MOVE,
            move: {
              from,
              to: sqaureRep,
            },
          })
        );
        chess.move(move);
        setBoard(chess.board());
        setFrom(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="text-black">
      {board.map((r, i) => (
        <div key={i} className="flex">
          {r.map((s, j) => {
            const sqaureRep = (String.fromCharCode(97 + (j % 8)) +
              "" +
              (8 - i)) as Square;
            return (
              <div
                onClick={() => handleClick(sqaureRep)}
                key={j}
                className={`w-16 h-16 ${
                  (i + j) % 2 === 0 ? "bg-green-500" : "bg-green-300"
                }   ${s?.color === "w" ? "text-white" : "text-black"}`}
              >
                <div className="flex justify-center w-full h-full">
                  <div className="flex flex-col justify-center h-full">
                    {s ? s.type : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default ChessBoard;
