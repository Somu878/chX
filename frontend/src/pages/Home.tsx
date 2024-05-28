import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  return (
    <div className="m-8 flex justify-center md:m-12">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <img className="max-w-80" src={"/phphK5JVu.png"} alt="chess board" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-semibold">Welcome to chX!</h1>
          <div className="text-lg text-center">
            Chess for everyone & everywhere
          </div>
          <button
            className="btn  btn-primary max-w-48 self-center mt-5"
            onClick={() => navigate("/game")}
          >
            Start a New Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
