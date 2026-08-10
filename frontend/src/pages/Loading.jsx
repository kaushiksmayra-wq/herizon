import "./Loading.css";

import { useNavigate, useLocation } from "react-router-dom";

import { useEffect, useState } from "react";

import PageTransition from "../components/PageTransition";


function Loading() {


    const navigate = useNavigate();

    const location = useLocation();


    const sessionData = location.state || {};



    const [progress, setProgress] = useState(0);

    const [message, setMessage] = useState(
        "Preparing Analysis..."
    );

    const [fade, setFade] = useState(true);

    const [lightsOut, setLightsOut] = useState(false);

    const [aiData, setAiData] = useState(null);





    const loadingMessages = {

        20: "Uploading Driver Radio...",

        40: "Generating Transcript...",

        60: "Detecting Driver Emotion...",

        80: "Calculating Stress Level...",

        100: "Generating AI Recommendation..."

    };






    useEffect(() => {


        const uploadAudio = async () => {


            const formData = new FormData();



            formData.append(
                "audio_file",
                sessionData.file
            );


            formData.append(
                "driver_name",
                sessionData.driver
            );


            formData.append(
                "team",
                sessionData.team
            );


            formData.append(
                "track",
                sessionData.track
            );


            formData.append(
                "lap_number",
                sessionData.lap
            );




            try {


                const response = await fetch(

                    "/api/upload/",

                    {

                        method: "POST",

                        body: formData

                    }

                );



                const data = await response.json();



                console.log(
                    "BACKEND RESPONSE:",
                    data
                );



                if(response.ok){


                    setAiData(data);


                }

                else {


                    setAiData({

                        transcript:
                        "AI processing failed.",


                        mood:
                        "Unavailable",


                        confidence:
                        0,


                        stress:
                        0,


                        summary:
                        "Backend returned an error.",


                        recommendations:[

                            "Check backend processing"

                        ]

                    });


                }



            }


            catch(error){


                console.log(
                    "UPLOAD ERROR:",
                    error
                );



                setAiData({

                    transcript:
                    "Backend connection failed.",


                    mood:
                    "Unavailable",


                    confidence:
                    0,


                    stress:
                    0,


                    summary:
                    "Unable to generate AI analysis.",


                    recommendations:[

                        "Restart backend server"

                    ]

                });


            }



        };





        uploadAudio();






        const steps = [
            20,
            40,
            60,
            80,
            100
        ];



        let index = 0;




        const interval = setInterval(() => {



            if(index < steps.length){



                setFade(false);



                setTimeout(() => {



                    const value = steps[index];



                    setProgress(value);



                    setMessage(
                        loadingMessages[value]
                    );



                    setFade(true);



                    index++;



                },250);



            }


            else {


                clearInterval(interval);


            }



        },1700);





        return () => clearInterval(interval);



    }, []);








    useEffect(() => {


        if(!aiData) return;




        setLightsOut(true);




        setTimeout(() => {



            navigate(

                "/results",

                {


                    state:{


                        driver:
                        sessionData.driver,


                        team:
                        sessionData.team,


                        track:
                        sessionData.track,


                        lap:
                        sessionData.lap,


                        transcript:
                        aiData.transcript || 
                        "No transcript generated.",



                        mood:
                        aiData.mood ||
                        "Analyzing",



                        confidence:
                        aiData.confidence ||
                        0,



                        stress:
                        aiData.stress ||
                        0,



                        stress_analysis:
                        aiData.stress_analysis ||
                        "No stress analysis available.",



                        assessment:
                        aiData.assessment ||
                        "Pending",



                        peakStress:
                        aiData.peakStress ||
                        "Analyzed",



                        summary:
                        aiData.summary ||
                        "No summary generated.",



                        recommendations:
                        aiData.recommendations ||
                        []



                    }


                }

            );



        },1200);



    },[aiData]);









    return(


        <PageTransition>


            <div className={`loading-page ${lightsOut ? "page-fade":""}`}>



                <div className="gantry">


                    <div className="start-lights">



                        <div className={`light ${progress >=20 && !lightsOut ? "active":""}`}></div>


                        <div className={`light ${progress >=40 && !lightsOut ? "active":""}`}></div>


                        <div className={`light ${progress >=60 && !lightsOut ? "active":""}`}></div>


                        <div className={`light ${progress >=80 && !lightsOut ? "active":""}`}></div>


                        <div className={`light ${progress >=100 && !lightsOut ? "active":""}`}></div>



                    </div>


                </div>






                <p className={`loading-status ${fade ? "fade-in":"fade-out"}`}>

                    {message}

                </p>



            </div>


        </PageTransition>


    );


}


export default Loading;