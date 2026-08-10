import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";

import uploadBg from "../assets/upload-bg.png";


function Upload() {


  const navigate = useNavigate();


  const [archiveOpen, setArchiveOpen] = useState(false);


  const [file, setFile] = useState(null);

  const [driver, setDriver] = useState("");

  const [team, setTeam] = useState("");

  const [track, setTrack] = useState("");

  const [lap, setLap] = useState("");


  const [error, setError] = useState("");



const startAnalysis = () => {


    if (!file || !driver || !team || !track || !lap) {


        setError(
            "Please upload an audio file and complete all session details."
        );


        return;

    }



    navigate("/loading", {

        state: {

            file,

            driver,

            team,

            track,

            lap

        }

    });


};



  return (

    <PageTransition>

      <>

        <div
          className="upload-background"
          style={{
            backgroundImage:`url(${uploadBg})`
          }}
        >


          <Navbar />


          <main className="upload-page">
                    {/* HEADER */}


          <div className="upload-header">


            <p className="section-tag">
              Race Analysis
            </p>



            <h1>
              UPLOAD & SESSION DETAILS
            </h1>



            <p className="upload-subtitle">

              Upload driver radio and provide session details

              <br />

              to begin AI-powered race analysis.

            </p>


          </div>





          {/* MAIN GRID */}



          <div className="upload-container">





            {/* LEFT CARD */}



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
                  in any audio format
                </p>





                <input

                  type="file"

                  id="audio-upload"

                  hidden

                 accept="audio/*"

                  onChange={(e)=>{


                    const selectedFile =
                    e.target.files[0];



                    if(selectedFile){



                      if(selectedFile.type.startsWith("audio/"))
{

    setFile(selectedFile);
    setError("");

}

else
{

    setFile(null);

    setError(
        "Only audio files are allowed."
    );

}


                    }



                  }}

                />





                <label

                  htmlFor="audio-upload"

                  className="browse-btn"

                >

                  Browse Files

                </label>





                {
                  file && (

                    <p className="file-name">

                      Selected: {file.name}

                    </p>

                  )
                }





                <div className="supported-formats">


                  <span>
                   All Audio Formats
                  </span>


                </div>




              </div>




            </div>
                      {/* RIGHT CARD */}



          <div className="details-card">



            <div className="details-header">


              <h2>
                Session Details
              </h2>



              <button

                className="archive-trigger"

                onClick={() => setArchiveOpen(true)}

              >

                📂 Archive

              </button>



            </div>





            <div className="form-group">


              <label>
                Driver Name
              </label>



              <input

                type="text"

                placeholder="e.g. Max Verstappen"

                value={driver}

                onChange={(e)=>setDriver(e.target.value)}

              />


            </div>







            <div className="form-group">


              <label>
                Team
              </label>




              <select

                value={team}

                onChange={(e)=>setTeam(e.target.value)}

              >



                <option value="">
                  Select Team
                </option>



                <option>
                  Red Bull Racing
                </option>



                <option>
                  Ferrari
                </option>



                <option>
                  Mercedes
                </option>



                <option>
                  McLaren
                </option>



                <option>
                  Aston Martin
                </option>



                <option>
                  Williams
                </option>



                <option>
                  Alpine
                </option>



                <option>
                  RB
                </option>



                <option>
                  Haas
                </option>



                <option>
                  Sauber
                </option>



              </select>


            </div>







            <div className="form-group">


              <label>
                Track
              </label>



              <input

                type="text"

                placeholder="e.g. Monaco"

                value={track}

                onChange={(e)=>setTrack(e.target.value)}

              />


            </div>







            <div className="form-group">


              <label>
                Lap Number
              </label>



              <input

                type="number"

                placeholder="e.g. 32"

                value={lap}

                onChange={(e)=>setLap(e.target.value)}

              />


            </div>




          </div>




        </div>







        {/* START ANALYSIS */}




        <div className="analysis-section">



          {
            error && (

              <p className="upload-error">

                {error}

              </p>

            )
          }





          <button

            className="analysis-btn"

            onClick={startAnalysis}

          >

            🏁 START ANALYSIS

          </button>




        </div>
                {/* ================= ARCHIVE DRAWER ================= */}



        <div

          className={`archive-drawer ${archiveOpen ? "open" : ""}`}

        >



          <div className="archive-top">


            <h2>
              📂 Race Radio Archive
            </h2>



            <button

              className="close-drawer"

              onClick={() => setArchiveOpen(false)}

            >

              ✕

            </button>



          </div>





          <div className="archive-item">


            <h3>
              🏁 Bahrain GP
            </h3>



            <p>
              Max Verstappen
            </p>



            <span>
              radio_001.mp3
            </span>



          </div>






          <div className="archive-item">


            <h3>
              🏁 Monaco GP
            </h3>



            <p>
              Charles Leclerc
            </p>



            <span>
              radio_002.mp3
            </span>



          </div>







          <div className="archive-item">


            <h3>
              🏁 Silverstone GP
            </h3>



            <p>
              Lewis Hamilton
            </p>



            <span>
              radio_003.mp3
            </span>



          </div>




        </div>





               </main>

      </div>

    </>

  </PageTransition>


  );

}
export default Upload;