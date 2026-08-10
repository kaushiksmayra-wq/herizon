import os

os.environ["PATH"] += os.pathsep + r"C:\ffmpeg\bin"


import whisper



# ==============================
# LOAD WHISPER
# ==============================


print("Loading Whisper model...")


whisper_model = whisper.load_model(
    "tiny",
    device="cpu"
)


print("AI models ready...")





# ==============================
# TRANSCRIPTION
# ==============================


def transcribe_audio(audio_path):

    result = whisper_model.transcribe(
        audio_path,
        fp16=False
    )


    text = result.get(
        "text",
        ""
    ).strip()


    if text == "":

        text = "No clear driver communication detected."


    return text






# ==============================
# EMOTION ANALYSIS
# ==============================


def analyze_emotion(text):


    text = text.lower()



    high_stress = [

        "panic",
        "can't",
        "cannot",
        "losing grip",
        "spinning",
        "crash",
        "damage",
        "broken",
        "no grip",
        "terrible"

    ]



    medium_stress = [

        "sliding",
        "understeer",
        "oversteer",
        "slow",
        "traffic",
        "tyres",
        "tires",
        "dropping",
        "struggle"

    ]



    positive = [

        "perfect",
        "amazing",
        "great",
        "fast",
        "pole",
        "catching",
        "comfortable"

    ]



    stress = 30



    for word in high_stress:

        if word in text:

            stress += 15



    for word in medium_stress:

        if word in text:

            stress += 7



    for word in positive:

        if word in text:

            stress -= 10





    stress = max(
        0,
        min(
            stress,
            100
        )
    )





    if stress >= 75:


        mood = "High Stress"

        assessment = (
            "Critical driver pressure detected"
        )



    elif stress >= 50:


        mood = "Pressure"

        assessment = (
            "Driver experiencing race pressure"
        )



    elif stress <= 25:


        mood = "Calm"

        assessment = (
            "Stable communication"
        )



    else:


        mood = "Focused"

        assessment = (
            "Controlled race communication"
        )





    confidence = min(
        95,
        70 + abs(stress-50)//2
    )





    return {


        "mood": mood,


        "confidence": confidence,


        "stress": stress,


        "assessment": assessment,


        "stress_analysis":

        (
            f"Driver communication indicates "
            f"{mood.lower()} behaviour with "
            f"{stress}% stress level."
        )

    }







# ==============================
# RECOMMENDATIONS
# ==============================


def generate_recommendation(
        transcript,
        emotion
):


    stress = emotion["stress"]



    if stress >= 75:


        recommendations = [

            "Reduce driver workload during critical moments",

            "Increase engineer support communication",

            "Monitor tyre and grip issues immediately"

        ]



    elif stress >= 50:


        recommendations = [

            "Monitor tyre degradation",

            "Maintain clear engineer communication",

            "Prepare driver for changing conditions"

        ]



    else:


        recommendations = [

            "Maintain current communication strategy",

            "Continue monitoring tyre feedback"

        ]





    return {


        "summary":

        (
            f"Driver shows "
            f"{emotion['mood'].lower()} "
            f"communication pattern with "
            f"{stress}% stress indication."
        ),



        "recommendations":

        recommendations,



        "stress_analysis":

        emotion["stress_analysis"],



        "assessment":

        emotion["assessment"],



        "stress":

        emotion["stress"],



        "mood":

        emotion["mood"],



        "confidence":

        emotion["confidence"]

    }