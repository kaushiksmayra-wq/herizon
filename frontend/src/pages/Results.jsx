import { useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Results.css";


function Results() {
  const navigate = useNavigate();
  const location = useLocation();

  const analysisData = location.state || {};


  // ============================================================
  // CHECK RESULT DATA
  // ============================================================

  useEffect(() => {
    if (!analysisData || Object.keys(analysisData).length === 0) {
      navigate("/upload");
    }
  }, [analysisData, navigate]);


  // ============================================================
  // TRANSCRIPT
  // ============================================================

  const transcript = useMemo(
    () =>
      Array.isArray(analysisData.transcript)
        ? analysisData.transcript
        : [
            {
              time: "00:00",
              text:
                analysisData.transcript ||
                "No transcript generated.",
            },
          ],
    [analysisData.transcript]
  );


  // ============================================================
  // SESSION DATA
  // ============================================================

  const session = useMemo(
    () => ({
      driver:
        analysisData.driver ||
        "Unknown Driver",

      team:
        analysisData.team ||
        "Unknown Team",

      track:
        analysisData.track ||
        "Unknown Track",

      lap:
        analysisData.lap ||
        "-",

      // --------------------------------------------------------
      // AI DATA
      // --------------------------------------------------------

      mood:
        analysisData.mood ||
        analysisData.ai_result?.[0]?.label ||
        "Analyzing",

      confidence:
        analysisData.confidence ?? 0,

      stress:
        analysisData.stress ?? 0,

      transcript,

      summary:
        analysisData.summary ||
        "AI summary will appear after audio processing.",

      recommendations:
        analysisData.recommendations ||
        [
          "Monitor driver communication patterns",
          "Analyze stress changes during critical moments",
          "Generate race strategy suggestions",
        ],

      transcription_error:
        analysisData.transcription_error ||
        null,

      emotion_error:
        analysisData.emotion_error ||
        null,
    }),
    [analysisData, transcript]
  );


  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="results-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="results-header">

        <button
          className="back-btn"
          onClick={() => navigate("/upload")}
        >
          ❮
        </button>


        <div className="header-center">

          <h1>
            SESSION INSIGHTS
          </h1>

          <p>
            AI-powered emotion, stress and communication analysis
          </p>

        </div>

      </header>


      {/* ======================================================
          SESSION BAR
      ====================================================== */}

      <section className="session-bar">

        <div className="session-item">

          <span>
            DRIVER
          </span>

          <strong>
            {session.driver}
          </strong>

        </div>


        <div className="session-item">

          <span>
            TEAM
          </span>

          <strong>
            {session.team}
          </strong>

        </div>


        <div className="session-item">

          <span>
            TRACK
          </span>

          <strong>
            {session.track}
          </strong>

        </div>


        <div className="session-item">

          <span>
            LAP
          </span>

          <strong>
            {session.lap !== "-"
              ? `LAP ${String(session.lap).padStart(2, "0")}`
              : "—"}
          </strong>

        </div>


        <div className="session-item">

          <span>
            SESSION
          </span>

          <strong>
            Race
          </strong>

        </div>

      </section>


      {/* ======================================================
          MAIN ANALYSIS GRID
      ====================================================== */}

      <main className="analysis-grid">


        {/* ==================================================
            DRIVER TRANSCRIPT
        ================================================== */}

        <div className="glass-card">

          <h2>
            DRIVER TRANSCRIPT
          </h2>


          {session.transcript.map(
            (line, index) => (

              <div
                className="radio-line"
                key={index}
              >

                <span>
                  {line.time}
                </span>

                <p>
                  "{line.text}"
                </p>

              </div>

            )
          )}

        </div>


        {/* ==================================================
            EMOTION ANALYSIS
        ================================================== */}

        <div className="glass-card">

          <h2>
            EMOTION ANALYSIS
          </h2>


          <div className="emotion-item">

            <span>
              Overall Emotion
            </span>

            <strong>
              {session.mood}
            </strong>

          </div>


          <div className="emotion-item">

            <span>
              Stress Level
            </span>

            <strong>
              {session.stress} / 100
            </strong>

          </div>


          <div className="emotion-item">

            <span>
              Confidence
            </span>

            <strong>
              {session.confidence}%
            </strong>

          </div>

        </div>

      </main>


      {/* ======================================================
          STRESS ANALYSIS
      ====================================================== */}

      <section className="stress-card glass-card">

        <h2>
          STRESS ANALYSIS
        </h2>


        <div className="stress-content">

          <p>
            {analysisData.stress_analysis ||
              "AI stress analysis will appear after audio processing."}
          </p>

          <p>
            Peak stress indicators will be detected from driver
            communication patterns and voice analysis.
          </p>

        </div>


        <div className="stress-summary">


          <div>

            <span>
              Average Stress
            </span>

            <strong>
              {session.stress}%
            </strong>

          </div>


          <div>

            <span>
              Peak Stress
            </span>

            <strong>
              {analysisData.peakStress ||
                analysisData.peak_stress ||
                "Analyzing"}
            </strong>

          </div>


          <div>

            <span>
              Assessment
            </span>

            <strong>
              {analysisData.assessment ||
                "Pending"}
            </strong>

          </div>


        </div>

      </section>


      {/* ======================================================
          RACE ENGINEER RECOMMENDATION
      ====================================================== */}

      <section className="recommendation-card glass-card">

        <h2>
          RACE ENGINEER RECOMMENDATION
        </h2>


        <div className="recommendation-content">


          <div className="ai-summary">

            <span>
              AI SUMMARY
            </span>

            <p>
              {session.summary}
            </p>

          </div>


          <div className="recommendation-list">

            <span>
              RECOMMENDED ACTIONS
            </span>


            <ul>

              {session.recommendations.map(
                (item, index) => (

                  <li key={index}>
                    {item}
                  </li>

                )
              )}

            </ul>

          </div>


        </div>

      </section>


      {/* ======================================================
          AI DIAGNOSTICS
      ====================================================== */}

      {(
        analysisData.transcription_error ||
        analysisData.emotion_error
      ) && (

        <section className="error-card glass-card">

          <h2>
            AI DIAGNOSTICS
          </h2>


          {analysisData.transcription_error && (

            <div className="error-block">

              <span>
                Transcription Error
              </span>

              <p>
                {analysisData.transcription_error}
              </p>

            </div>

          )}


          {analysisData.emotion_error && (

            <div className="error-block">

              <span>
                Emotion Analysis Error
              </span>

              <p>
                {analysisData.emotion_error}
              </p>

            </div>

          )}

        </section>

      )}

    </div>
  );
}


export default Results;