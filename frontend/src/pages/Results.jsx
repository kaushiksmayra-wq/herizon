import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Results.css";


function Results() {


    const navigate = useNavigate();

    const location = useLocation();


    const [showExport, setShowExport] = useState(false);



    const analysisData = location.state || {};
    console.log("RESULT DATA:", analysisData);



    const session = {

    driver: analysisData.driver || "Unknown Driver",

    team: analysisData.team || "Unknown Team",

    track: analysisData.track || "Unknown Track",

    lap: analysisData.lap || "-",

     mood:
analysisData.ai_result?.[0]?.label || 
analysisData.mood || 
"Analyzing",
        confidence: analysisData.confidence || "0",

      stress: analysisData.stress || "0",

ai_result: analysisData.ai_result || null,

       transcript:

Array.isArray(analysisData.transcript)

?

analysisData.transcript

:

[

    {
        time:"00:00",
        text:
        analysisData.transcript ||
        "No transcript generated."
    }

],
        summary:
        analysisData.summary ||
        "AI summary will appear after audio processing.",



        recommendations:
        analysisData.recommendations ||
        [

            "Monitor driver communication patterns",

            "Analyze stress changes during critical moments",

            "Generate race strategy suggestions"

        ]

    };



return (

<div className="results-page">


<header className="results-header">


<button

className="back-btn"

onClick={()=>navigate("/upload")}

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



<button

className="export-btn"

onClick={()=>setShowExport(true)}

>

Export PDF

</button>


</header>
    {/* SESSION BAR */}



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
                {session.lap}
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







    {/* TOP ANALYSIS CARDS */}




    <main className="analysis-grid">






        {/* DRIVER TRANSCRIPT */}





        <div className="glass-card">



            <h2>
                DRIVER TRANSCRIPT
            </h2>





            {

            session.transcript.map((line,index)=>(


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



            ))

            }





        </div>









        {/* EMOTION ANALYSIS */}





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
        {/* STRESS ANALYSIS */}



    <section className="stress-card glass-card">



        <h2>
            STRESS ANALYSIS
        </h2>





        <div className="stress-content">



            <p>

                {
                    analysisData.stress_analysis ||
                    "AI stress analysis will appear after audio processing."
                }

            </p>





            <p>

                Peak stress indicators will be detected from
                driver communication patterns and voice analysis.

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

                    {
                        analysisData.peakStress ||
                        "Analyzing"

                    }

                </strong>



            </div>







            <div>


                <span>
                    Assessment
                </span>



                <strong>

                    {
                        analysisData.assessment ||
                        "Pending"

                    }

                </strong>



            </div>





        </div>





    </section>









    {/* ENGINEER RECOMMENDATION */}





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



                    {

                    session.recommendations.map((item,index)=>(


                        <li key={index}>

                            {item}

                        </li>


                    ))

                    }




                </ul>





            </div>





        </div>






    </section>
        {/* EXPORT POPUP */}




    {
        showExport && (


            <div className="export-overlay">



                <div className="export-box">



                    <h2>
                        EXPORT SESSION REPORT
                    </h2>




                    <p>

                        Generate a PDF report containing
                        transcript, emotion analysis,
                        stress analysis and recommendations.

                    </p>






                    <button

                    className="generate-btn"

                    >

                        Generate PDF

                    </button>







                    <button

                    className="close-btn"

                    onClick={()=>setShowExport(false)}

                    >

                        Cancel

                    </button>





                </div>




            </div>



        )
    }





</div>


);


}


export default Results;