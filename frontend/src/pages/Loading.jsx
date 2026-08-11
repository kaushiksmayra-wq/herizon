import "./Loading.css";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import PageTransition from "../components/PageTransition";


const loadingMessages = {
  20: "Preparing Race Radio...",
  40: "Generating Transcript...",
  60: "Detecting Driver Emotion...",
  80: "Calculating Stress Level...",
  100: "Generating AI Recommendation...",
};


function Loading() {

  const navigate = useNavigate();
  const location = useLocation();

  const sessionData = location.state || {};

  const {
    session_id,
    driver,
    team,
    track,
    lap
  } = sessionData;


  const [progress, setProgress] = useState(0);

  const [message, setMessage] = useState(
    "Preparing Analysis..."
  );

  const [fade, setFade] = useState(true);

  const [lightsOut, setLightsOut] = useState(false);

  const [aiData, setAiData] = useState(null);

  const [analysisFinished, setAnalysisFinished] =
    useState(false);

  const [visualLoadingFinished, setVisualLoadingFinished] =
    useState(false);


  /*
  ============================================================
  CHECK SESSION + START AI ANALYSIS
  ============================================================
  */

  useEffect(() => {

    if (!session_id) {

      console.error(
        "No session_id received."
      );

      navigate("/upload");

      return;

    }


    /*
    ==========================================================
    START REAL AI ANALYSIS IMMEDIATELY
    ==========================================================
    */

    const analyzeRace = async () => {

      try {

        console.log(
          "ANALYZING SESSION:",
          session_id
        );


        const response = await fetch(
          `http://127.0.0.1:8001/api/analyze/${session_id}/`,
          {
            method: "POST"
          }
        );


        const data = await response.json();


        console.log(
          "ANALYSIS RESPONSE:",
          data
        );


        if (!response.ok) {

          throw new Error(
            data.error ||
            "Analysis failed"
          );

        }


        /*
        ======================================================
        AI ANALYSIS FINISHED
        ======================================================
        */

        console.log(
          "AI ANALYSIS COMPLETE"
        );


        setAiData(data);

        setAnalysisFinished(true);


      } catch (error) {

        console.error(
          "ANALYSIS ERROR:",
          error
        );


        /*
        ======================================================
        FALLBACK
        ======================================================
        */

        const failedData = {

          transcript:
            "Unable to generate transcript.",

          mood:
            "Unavailable",

          confidence:
            0,

          stress:
            0,

          stress_analysis:
            "No stress analysis available.",

          assessment:
            "Analysis Failed",

          peak_stress:
            "Unavailable",

          peakStress:
            "Unavailable",

          summary:
            "Unable to generate AI analysis.",

          recommendations: [
            "Please check the backend analysis service."
          ],

          ai_result:
            null,

          transcription_error:
            error.message,

          emotion_error:
            error.message

        };


        setAiData(
          failedData
        );

        setAnalysisFinished(true);

      }

    };


    analyzeRace();


  }, [
    session_id,
    navigate
  ]);


  /*
  ============================================================
  F1 LIGHTS LOADING ANIMATION

  This animation is COMPLETELY INDEPENDENT
  from the AI request.

  This guarantees that the user sees
  all 5 lights even if AI finishes quickly.
  ============================================================
  */

  useEffect(() => {

    if (!session_id) {

      return;

    }


    const steps = [
      20,
      40,
      60,
      80,
      100
    ];


    let index = 0;


    /*
    ----------------------------------------------------------
    FIRST LIGHT
    ----------------------------------------------------------
    */

    setProgress(20);

    setMessage(
      loadingMessages[20]
    );


    /*
    ----------------------------------------------------------
    EACH LIGHT APPEARS EVERY 1 SECOND
    ----------------------------------------------------------
    */

    const interval = setInterval(() => {

      index += 1;


      if (index >= steps.length) {

        clearInterval(interval);

        setProgress(100);

        setMessage(
          loadingMessages[100]
        );

        setVisualLoadingFinished(true);

        return;

      }


      const value = steps[index];


      /*
      Fade old message out
      */

      setFade(false);


      setTimeout(() => {

        setProgress(value);

        setMessage(
          loadingMessages[value]
        );

        setFade(true);

      }, 180);


    }, 1000);


    /*
    ----------------------------------------------------------
    CLEANUP
    ----------------------------------------------------------
    */

    return () => {

      clearInterval(interval);

    };


  }, [
    session_id
  ]);


  /*
  ============================================================
  GO TO RESULTS

  We wait for BOTH:

  1. AI analysis to finish
  2. All 5 lights to finish
  ============================================================
  */

  useEffect(() => {

    if (!analysisFinished) {

      return;

    }


    if (!visualLoadingFinished) {

      return;

    }


    /*
    ==========================================================
    LIGHTS OUT
    ==========================================================
    */

    setLightsOut(true);


    /*
    ==========================================================
    SMALL TRANSITION DELAY
    ==========================================================
    */

    const timer = setTimeout(() => {


      navigate(
        "/results",
        {
          state: {

            /*
            ==================================================
            SESSION INFORMATION
            ==================================================
            */

            session_id,

            driver,

            team,

            track,

            lap,


            /*
            ==================================================
            TRANSCRIPT
            ==================================================
            */

            transcript:
              aiData.transcript ||
              "No transcript generated.",


            /*
            ==================================================
            EMOTION
            ==================================================
            */

            mood:
              aiData.mood ||
              "Analyzed",


            /*
            ==================================================
            CONFIDENCE
            ==================================================
            */

            confidence:
              aiData.confidence ??
              0,


            /*
            ==================================================
            STRESS
            ==================================================
            */

            stress:
              aiData.stress ??
              0,


            /*
            ==================================================
            STRESS ANALYSIS
            ==================================================
            */

            stress_analysis:
              aiData.stress_analysis ||
              "No stress analysis available.",


            /*
            ==================================================
            ASSESSMENT
            ==================================================
            */

            assessment:
              aiData.assessment ||
              "Analyzed",


            /*
            ==================================================
            PEAK STRESS
            ==================================================
            */

            peakStress:
              aiData.peakStress ||
              aiData.peak_stress ||
              "Analyzed",


            /*
            ==================================================
            SUMMARY
            ==================================================
            */

            summary:
              aiData.summary ||
              "No summary generated.",


            /*
            ==================================================
            RECOMMENDATIONS
            ==================================================
            */

            recommendations:
              aiData.recommendations ||
              [],


            /*
            ==================================================
            AI RESULT
            ==================================================
            */

            ai_result:
              aiData.ai_result ||
              null,


            /*
            ==================================================
            ERRORS
            ==================================================
            */

            transcription_error:
              aiData.transcription_error ||
              null,

            emotion_error:
              aiData.emotion_error ||
              null

          }

        }

      );


    }, 700);


    return () => {

      clearTimeout(timer);

    };


  }, [
    analysisFinished,
    visualLoadingFinished,
    aiData,
    session_id,
    driver,
    team,
    track,
    lap,
    navigate
  ]);


  /*
  ============================================================
  UI
  ============================================================
  */

  return (

    <PageTransition>

      <div
        className={`loading-page ${
          lightsOut
            ? "page-fade"
            : ""
        }`}
      >


        <div className="gantry">


          <div className="start-lights">


            {/* =========================================
                LIGHT 1
            ========================================= */}

            <div
              className={`light ${
                progress >= 20 &&
                !lightsOut
                  ? "active"
                  : ""
              }`}
            />


            {/* =========================================
                LIGHT 2
            ========================================= */}

            <div
              className={`light ${
                progress >= 40 &&
                !lightsOut
                  ? "active"
                  : ""
              }`}
            />


            {/* =========================================
                LIGHT 3
            ========================================= */}

            <div
              className={`light ${
                progress >= 60 &&
                !lightsOut
                  ? "active"
                  : ""
              }`}
            />


            {/* =========================================
                LIGHT 4
            ========================================= */}

            <div
              className={`light ${
                progress >= 80 &&
                !lightsOut
                  ? "active"
                  : ""
              }`}
            />


            {/* =========================================
                LIGHT 5
            ========================================= */}

            <div
              className={`light ${
                progress >= 100 &&
                !lightsOut
                  ? "active"
                  : ""
              }`}
            />


          </div>

        </div>


        {/* =============================================
            LOADING MESSAGE
        ============================================= */}

        <p
          className={`loading-status ${
            fade
              ? "fade-in"
              : "fade-out"
          }`}
        >

          {message}

        </p>


      </div>

    </PageTransition>

  );

}


export default Loading;