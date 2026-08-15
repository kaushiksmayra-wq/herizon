import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";

import uploadBg from "../assets/upload-bg.png";


function Upload() {

  const navigate = useNavigate();


  // ==========================================
  // STATES
  // ==========================================

  const [file, setFile] = useState(null);

  const [driver, setDriver] = useState("");

  const [team, setTeam] = useState("");

  const [track, setTrack] = useState("");

  const [lap, setLap] = useState("");

  const [error, setError] = useState("");


  // ==========================================
  // SUPPORTED AUDIO FORMATS
  // ==========================================

  const allowedExtensions = [
    "mp3",
    "wav",
    "m4a",
    "aac",
    "flac",
    "ogg",
    "oga",
    "webm",
    "wma",
    "opus",
    "mp4"
  ];


  // ==========================================
  // HANDLE AUDIO FILE
  // ==========================================

  const handleFileChange = (event) => {

    const selectedFile =
      event.target.files[0];

    if (!selectedFile) {
      return;
    }


    const fileExtension =
      selectedFile.name
        .split(".")
        .pop()
        .toLowerCase();


    const isAudioMime =
      selectedFile.type &&
      selectedFile.type.startsWith("audio/");


    const isSupportedExtension =
      allowedExtensions.includes(fileExtension);


    // ==========================================
    // VALIDATE AUDIO
    // ==========================================

    if (
      isAudioMime ||
      isSupportedExtension
    ) {

      setFile(selectedFile);

      setError("");

    } else {

      setFile(null);

      setError(
        "Please select a supported audio file."
      );

    }

  };


  // ==========================================
  // START ANALYSIS
  // ==========================================

  const startAnalysis = async () => {


    // ========================================
    // BASIC VALIDATION
    // ========================================

    if (
      !file ||
      !driver ||
      !team ||
      !track ||
      !lap
    ) {

      setError(
        "Please upload an audio file and complete all session details."
      );

      return;

    }


    // ========================================
    // LAP VALIDATION
    // ========================================

    const lapNumberValue =
      Number(lap);


    if (
      !Number.isInteger(lapNumberValue) ||
      lapNumberValue < 1
    ) {

      setError(
        "Please enter a valid lap number."
      );

      return;

    }


    setError("");


    try {


      // ======================================
      // CREATE FORM DATA
      // ======================================

      const formData = new FormData();


      formData.append(
        "audio_file",
        file
      );


      formData.append(
        "driver_name",
        driver
      );


      formData.append(
        "team",
        team
      );


      formData.append(
        "track",
        track
      );


      formData.append(
        "lap_number",
        lapNumberValue
      );


      // ======================================
      // DEBUG LOGGING
      // ======================================

      console.log(
        "==================================="
      );

      console.log(
        "UPLOADING RACE AUDIO"
      );

      console.log(
        "==================================="
      );


      console.log(
        "Audio:",
        file.name
      );


      console.log(
        "Type:",
        file.type
      );


      console.log(
        "Driver:",
        driver
      );


      console.log(
        "Team:",
        team
      );


      console.log(
        "Track:",
        track
      );


      console.log(
        "Lap:",
        lapNumberValue
      );


      // ======================================
      // SEND TO DJANGO
      // ======================================

      const response = await fetch(
  "https://herizon-yn7o.vercel.app/api/upload/",
  {
    method: "POST",
    body: formData
  }
);


      const text = await response.text();
console.log("BACKEND STATUS:", response.status);
console.log("BACKEND RESPONSE:", text);

      console.log(
        "==================================="
      );

      console.log(
        "BACKEND UPLOAD RESPONSE"
      );

      console.log(
        "==================================="
      );


      console.log(data);


      // ======================================
      // HANDLE ERROR
      // ======================================

      if (!response.ok) {

        throw new Error(
          data.detail ||
          data.message ||
          data.error ||
          "Audio upload failed."
        );

      }


      // ======================================
      // SESSION ID CHECK
      // ======================================

      if (!data.session_id) {

        console.error(
          "No session_id returned:",
          data
        );

        throw new Error(
          "Upload succeeded, but the backend did not return a session ID."
        );

      }


      console.log(
        "SESSION CREATED:",
        data.session_id
      );


      // ======================================
      // GO TO LOADING PAGE
      // ======================================

      navigate(
        "/loading",
        {
          state: {

            session_id:
              data.session_id,

            driver:
              driver,

            team:
              team,

            track:
              track,

            lap:
              lapNumberValue

          }
        }
      );


    } catch (error) {


      console.error(
        "UPLOAD ERROR:",
        error
      );


      setError(
        error.message ||
        "Unable to upload the audio file. Please make sure the Django backend is running."
      );

    }

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <PageTransition>

      <>

        <div
          className="upload-background"
          style={{
            backgroundImage:
              `url(${uploadBg})`
          }}
        >

          <Navbar />


          <main className="upload-page">


            {/* =====================================
                HEADER
            ====================================== */}

            <div className="upload-header">

              <p className="section-tag">
                Race Analysis
              </p>


              <h1>
                UPLOAD & SESSION DETAILS
              </h1>


              <p className="upload-subtitle">

                Upload driver radio and provide
                session details

                <br />

                to begin AI-powered race analysis.

              </p>

            </div>


            {/* =====================================
                MAIN GRID
            ====================================== */}

            <div className="upload-container">


              {/* ===================================
                  LEFT CARD
              ==================================== */}

              <div className="upload-card">

                <h2>
                  Upload Race Radio
                </h2>


                <div className="upload-placeholder">


                  <div className="upload-icon">
                    🎧
                  </div>


                  <h3>
                    Drag & Drop Audio
                  </h3>


                  <p>

                    Upload Formula 1 race radio

                    <br />

                    in any supported audio format

                  </p>


                  {/* =================================
                      FILE INPUT
                  ================================== */}

                  <input

                    type="file"

                    id="audio-upload"

                    hidden

                    accept="
                      .mp3,
                      .wav,
                      .m4a,
                      .aac,
                      .flac,
                      .ogg,
                      .oga,
                      .webm,
                      .wma,
                      .opus,
                      .mp4,
                      audio/*
                    "

                    onChange={
                      handleFileChange
                    }

                  />


                  {/* =================================
                      BROWSE BUTTON
                  ================================== */}

                  <label

                    htmlFor="audio-upload"

                    className="browse-btn"

                  >

                    Browse Files

                  </label>


                  {/* =================================
                      SELECTED FILE
                  ================================== */}

                  {file && (

                    <div className="file-name">

                      <strong>
                        Selected:
                      </strong>

                      <br />

                      {file.name}

                    </div>

                  )}


                  {/* =================================
                      FORMAT INFORMATION
                  ================================== */}

                  <div className="supported-formats">

                    <span>
                      MP3
                    </span>

                    <span>
                      WAV
                    </span>

                    <span>
                      M4A
                    </span>

                    <span>
                      AAC
                    </span>

                    <span>
                      FLAC
                    </span>

                    <span>
                      OGG
                    </span>

                    <span>
                      WEBM
                    </span>

                    <span>
                      OPUS
                    </span>

                  </div>


                </div>

              </div>


              {/* ===================================
                  RIGHT CARD
              ==================================== */}

              <div className="details-card">


                <div className="details-header">

                  <h2>
                    Session Details
                  </h2>

                </div>


                {/* =================================
                    DRIVER
                ================================== */}

                <div className="form-group">

                  <label>
                    Driver Name
                  </label>


                  <input

                    type="text"

                    placeholder="e.g. Max Verstappen"

                    value={driver}

                    onChange={(e) =>
                      setDriver(
                        e.target.value
                      )
                    }

                  />

                </div>


                {/* =================================
                    TEAM
                ================================== */}

                <div className="form-group">

                  <label>
                    Team
                  </label>


                  <select

                    value={team}

                    onChange={(e) =>
                      setTeam(
                        e.target.value
                      )
                    }

                  >

                    <option value="">
                      Select Team
                    </option>


                    <option value="Red Bull Racing">
                      Red Bull Racing
                    </option>


                    <option value="Ferrari">
                      Ferrari
                    </option>


                    <option value="Mercedes">
                      Mercedes
                    </option>


                    <option value="McLaren">
                      McLaren
                    </option>


                    <option value="Aston Martin">
                      Aston Martin
                    </option>


                    <option value="Williams">
                      Williams
                    </option>


                    <option value="Alpine">
                      Alpine
                    </option>


                    <option value="RB">
                      RB
                    </option>


                    <option value="Haas">
                      Haas
                    </option>


                    <option value="Sauber">
                      Sauber
                    </option>

                  </select>

                </div>


                {/* =================================
                    TRACK
                ================================== */}

                <div className="form-group">

                  <label>
                    Track
                  </label>


                  <input

                    type="text"

                    placeholder="e.g. Monaco"

                    value={track}

                    onChange={(e) =>
                      setTrack(
                        e.target.value
                      )
                    }

                  />

                </div>


                {/* =================================
                    LAP NUMBER
                ================================== */}

                <div className="form-group">

                  <label>
                    Lap Number
                  </label>


                  <input

                    type="number"

                    placeholder="e.g. 32"

                    min="1"

                    value={lap}

                    onChange={(e) =>
                      setLap(
                        e.target.value
                      )
                    }

                  />

                </div>


              </div>

            </div>


            {/* =====================================
                START ANALYSIS
            ====================================== */}

            <div className="analysis-section">


              {error && (

                <p className="upload-error">
                  {error}
                </p>

              )}


              <button

                type="button"

                className="analysis-btn"

                onClick={startAnalysis}

              >

                🏁 START ANALYSIS

              </button>


            </div>


          </main>

        </div>

      </>

    </PageTransition>

  );

}


export default Upload;