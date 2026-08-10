import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";
import background from "../assets/background.png";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return (
     <PageTransition>
    <div
      className="background-image"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Navbar />

      <main className="hero">
        <h1>
          THE <br />
          SILENT <br />
          <span className="red-text">CO-DRIVER</span>
        </h1>

        <p className="powered">
          Powered by Herizon AI
        </p>

        <p className="subtitle">
          Every radio message tells a story.
          <br />
          Every emotion shapes the race.
        </p>

        <button
          className="hero-btn"
          onClick={() => navigate("/upload")}
        >
          🏁 START RACE ANALYSIS
        </button>
      </main>
    </div>
     </PageTransition>
  );
}

export default Home;