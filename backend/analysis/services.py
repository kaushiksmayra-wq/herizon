import os

from pathlib import Path

from dotenv import load_dotenv

from huggingface_hub import InferenceClient

from transformers import pipeline


# ============================================================
# ENVIRONMENT
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

dotenv_path = BASE_DIR / ".env"

if dotenv_path.exists():
    load_dotenv(dotenv_path)


HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY")


if not HF_API_KEY:
    raise RuntimeError(
        "HUGGINGFACE_API_KEY is missing. "
        "Add it to backend/.env."
    )


# ============================================================
# HUGGING FACE CLIENT
# ============================================================

hf_client = InferenceClient(
    token=HF_API_KEY,
    provider="hf-inference"
)


# ============================================================
# MODELS
# ============================================================

WHISPER_MODEL = "openai/whisper-large-v3"

EMOTION_MODEL = "superb/wav2vec2-base-superb-er"


# ============================================================
# LOAD EMOTION MODEL
# ============================================================

print("===================================")
print("LOADING HUGGING FACE EMOTION MODEL")
print("===================================")

try:

    emotion_classifier = pipeline(
        "audio-classification",
        model=EMOTION_MODEL,
        top_k=4
    )

    print("Emotion model loaded successfully.")

except Exception as error:

    print("===================================")
    print("EMOTION MODEL LOAD ERROR")
    print("===================================")

    print(error)

    emotion_classifier = None


# ============================================================
# TRANSCRIPT CONTEXT ANALYSIS
# ============================================================

def analyze_transcript_context(transcript):

    """
    Analyze the transcript for obvious conversational context.

    This is used as a supporting signal alongside the
    audio emotion model.

    It is NOT a psychological diagnosis.
    """

    text = transcript.lower().strip()


    # ========================================================
    # STRONG STRESS / AGGRESSION PHRASES
    #
    # IMPORTANT:
    #
    # "what are you doing" is intentionally NOT here.
    # It can be a completely normal/casual sentence.
    # ========================================================

    strong_stress_phrases = [

        "get out of my way",

        "give me space",

        "move",

        "what the hell",

        "what the fuck",

        "shut up",

        "leave me alone",

        "stop doing that",

        "stop it",

        "you idiot",

        "are you blind",

        "this is ridiculous",

        "unbelievable",

        "why did you do that",

        "you just hit me",

        "you just crashed",

        "he just hit me",

        "he just crashed",

        "i can't believe this",

        "this is insane",

    ]


    # ========================================================
    # CALM / CASUAL PHRASES
    # ========================================================

    calm_phrases = [

        "hello",

        "hello friends",

        "hi",

        "hey",

        "hey guys",

        "hey everyone",

        "what are you doing",

        "how are you",

        "good morning",

        "good evening",

        "thank you",

        "thanks",

        "okay",

        "alright",

        "all good",

        "no problem",

        "sounds good",

        "yeah",

        "yes",

        "sure",

        "fine",

    ]


    # ========================================================
    # COUNT MATCHES
    # ========================================================

    strong_matches = 0

    calm_matches = 0


    for phrase in strong_stress_phrases:

        if phrase in text:
            strong_matches += 1


    for phrase in calm_phrases:

        if phrase in text:
            calm_matches += 1


    # ========================================================
    # STRONG STRESS LANGUAGE
    #
    # Only classify as stress when there is explicit
    # stressful/aggressive wording.
    # ========================================================

    if strong_matches > 0:

        return {
            "type": "stress",
            "score": 85
        }


    # ========================================================
    # CLEARLY CASUAL LANGUAGE
    # ========================================================

    if calm_matches > 0:

        return {
            "type": "calm",
            "score": 10
        }


    # ========================================================
    # NO STRONG CONTEXT
    # ========================================================

    return {
        "type": "neutral",
        "score": 40
    }


# ============================================================
# PROCESS RACE AUDIO
# ============================================================

def process_race_audio(session):

    """
    Complete race-radio analysis pipeline.

    Audio
        ↓
    Hugging Face Whisper
        ↓
    Transcript
        ↓
    Voice Emotion Model
        ↓
    Transcript Context
        ↓
    Combined Mood + Stress
        ↓
    Database
    """

    # ========================================================
    # AUDIO PATH
    # ========================================================

    audio_path = session.audio_file.path


    # ========================================================
    # CHECK FILE
    # ========================================================

    if not os.path.exists(audio_path):

        raise FileNotFoundError(
            f"Audio file not found: {audio_path}"
        )


    print("===================================")
    print("PROCESSING RACE AUDIO")
    print("===================================")

    print("Session:", session.id)

    print("Audio:", audio_path)


    # ========================================================
    # WHISPER TRANSCRIPTION
    # ========================================================

    print("===================================")
    print("STARTING HUGGING FACE WHISPER")
    print("===================================")

    print("Model:", WHISPER_MODEL)

    print("Language: English")


    try:

        result = hf_client.automatic_speech_recognition(

            audio=audio_path,

            model=WHISPER_MODEL,

            extra_body={
                "generate_kwargs": {
                    "language": "en",
                    "task": "transcribe"
                }
            }

        )


    except Exception as error:

        print("===================================")
        print("HUGGING FACE WHISPER ERROR")
        print("===================================")

        print(error)

        raise RuntimeError(
            f"Hugging Face transcription failed: {error}"
        )


    # ========================================================
    # GET TRANSCRIPT
    # ========================================================

    transcript = getattr(
        result,
        "text",
        ""
    )


    transcript = transcript.strip()


    if not transcript:

        raise RuntimeError(
            "Hugging Face returned an empty transcript."
        )


    print("===================================")
    print("TRANSCRIPTION COMPLETE")
    print("===================================")

    print("TRANSCRIPT:")

    print(transcript)


    # ========================================================
    # TRANSCRIPT CONTEXT
    # ========================================================

    text_context = analyze_transcript_context(
        transcript
    )


    print("===================================")
    print("TRANSCRIPT CONTEXT")
    print("===================================")

    print(
        "Context type:",
        text_context["type"]
    )

    print(
        "Context score:",
        text_context["score"]
    )


    # ========================================================
    # DEFAULT VALUES
    # ========================================================

    mood = "Neutral"

    confidence = 0

    stress = 0

    stress_analysis = (
        "Emotion analysis is unavailable."
    )

    assessment = (
        "Speech transcription completed."
    )

    peak_stress = "0 / 100"


    # ========================================================
    # EMOTION ANALYSIS
    # ========================================================

    print("===================================")
    print("STARTING HUGGING FACE EMOTION ANALYSIS")
    print("===================================")

    print("Model:", EMOTION_MODEL)


    if emotion_classifier is None:

        print(
            "Emotion classifier is not available."
        )


    else:

        try:

            emotion_results = emotion_classifier(
                audio_path
            )


            print("===================================")
            print("RAW EMOTION RESULTS")
            print("===================================")

            print(emotion_results)

            print("===================================")


            # ==================================================
            # CREATE EMOTION SCORE DICTIONARY
            # ==================================================

            emotion_scores = {}


            for item in emotion_results:

                label = item["label"].lower()

                score = float(
                    item["score"]
                )

                emotion_scores[label] = score


            # ==================================================
            # INDIVIDUAL EMOTION SCORES
            # ==================================================

            happy_score = emotion_scores.get(
                "hap",
                emotion_scores.get(
                    "happy",
                    0
                )
            )


            angry_score = emotion_scores.get(
                "ang",
                emotion_scores.get(
                    "angry",
                    0
                )
            )


            sad_score = emotion_scores.get(
                "sad",
                0
            )


            neutral_score = emotion_scores.get(
                "neu",
                emotion_scores.get(
                    "neutral",
                    0
                )
            )


            # ==================================================
            # VOICE EMOTION
            # ==================================================

            voice_emotions = {

                "Happy": happy_score,

                "Angry": angry_score,

                "Sad": sad_score,

                "Neutral": neutral_score

            }


            voice_mood = max(
                voice_emotions,
                key=voice_emotions.get
            )


            voice_confidence = voice_emotions[
                voice_mood
            ]


            # ==================================================
            # VOCAL STRESS
            # ==================================================

            if angry_score < 0.30:

                vocal_stress = (
                    sad_score * 20
                )


            elif angry_score < 0.50:

                vocal_stress = (

                    angry_score * 45

                    +

                    sad_score * 20

                )


            else:

                vocal_stress = (

                    angry_score * 100

                    +

                    sad_score * 30

                )


            vocal_stress = max(

                0,

                min(

                    100,

                    vocal_stress

                )

            )


            # ==================================================
            # COMBINE VOICE + TRANSCRIPT
            # ==================================================

            if text_context["type"] == "calm":

                stress = (

                    vocal_stress * 0.35

                    +

                    text_context["score"] * 0.65

                )


            elif text_context["type"] == "stress":

                stress = (

                    vocal_stress * 0.70

                    +

                    text_context["score"] * 0.30

                )


            else:

                stress = (

                    vocal_stress * 0.60

                    +

                    text_context["score"] * 0.40

                )


            stress = int(
                round(stress)
            )


            stress = max(

                0,

                min(

                    100,

                    stress

                )

            )


            # ==================================================
            # FINAL MOOD
            # ==================================================

            if text_context["type"] == "calm":

                # A clearly casual transcript should not
                # become Angry solely because the acoustic
                # model is uncertain.

                if happy_score >= 0.50:

                    mood = "Happy"

                elif (
                    voice_mood == "Sad"
                    and
                    sad_score >= 0.65
                ):

                    mood = "Sad"

                else:

                    mood = "Neutral"


            elif text_context["type"] == "stress":

                if angry_score >= 0.45:

                    mood = "Angry"

                elif sad_score >= 0.60:

                    mood = "Sad"

                elif happy_score >= 0.50:

                    mood = "Happy"

                else:

                    mood = voice_mood


            else:

                # Without useful textual context,
                # require stronger evidence before calling
                # something Angry.

                if voice_mood == "Angry":

                    if angry_score >= 0.70:

                        mood = "Angry"

                    else:

                        mood = "Neutral"


                elif voice_mood == "Sad":

                    if sad_score >= 0.65:

                        mood = "Sad"

                    else:

                        mood = "Neutral"


                elif voice_mood == "Happy":

                    if happy_score >= 0.50:

                        mood = "Happy"

                    else:

                        mood = "Neutral"


                else:

                    mood = "Neutral"


            # ==================================================
            # CONFIDENCE
            # ==================================================

            confidence = int(

                max(

                    0,

                    min(

                        100,

                        round(
                            voice_confidence * 100
                        )

                    )

                )

            )


            # ==================================================
            # STRESS ANALYSIS
            # ==================================================

            if stress < 30:

                stress_analysis = (

                    "Low stress indicators detected. "

                    "The driver's communication appears "

                    "relatively calm and controlled."

                )


            elif stress < 60:

                stress_analysis = (

                    "Moderate stress indicators detected. "

                    "Some emotional intensity is present "

                    "in the driver's communication."

                )


            else:

                stress_analysis = (

                    "High stress indicators detected. "

                    "The driver's communication shows "

                    "significant emotional intensity."

                )


            # ==================================================
            # ASSESSMENT
            # ==================================================

            if mood == "Happy":

                assessment = (

                    "The driver's communication appears "

                    "positive and emotionally controlled."

                )


            elif mood == "Neutral":

                assessment = (

                    "The driver's communication appears "

                    "neutral and controlled."

                )


            elif mood == "Sad":

                assessment = (

                    "The driver's voice contains signs "

                    "of lower-energy emotional expression."

                )


            elif mood == "Angry":

                if stress >= 60:

                    assessment = (

                        "The driver's communication shows "

                        "strong emotional intensity and "

                        "elevated stress indicators."

                    )

                else:

                    assessment = (

                        "The driver's voice shows signs "

                        "of emotional intensity, but overall "

                        "stress remains moderate."

                    )


            else:

                assessment = (
                    "The driver's communication was analyzed."
                )


            # ==================================================
            # PEAK STRESS
            # ==================================================

            peak_stress = f"{stress} / 100"


            # ==================================================
            # DEBUG OUTPUT
            # ==================================================

            print("===================================")
            print("COMBINED ANALYSIS")
            print("===================================")

            print(
                "Happy:",
                round(
                    happy_score * 100,
                    2
                ),
                "%"
            )

            print(
                "Angry:",
                round(
                    angry_score * 100,
                    2
                ),
                "%"
            )

            print(
                "Sad:",
                round(
                    sad_score * 100,
                    2
                ),
                "%"
            )

            print(
                "Neutral:",
                round(
                    neutral_score * 100,
                    2
                ),
                "%"
            )

            print(
                "Voice mood:",
                voice_mood
            )

            print(
                "Final mood:",
                mood
            )

            print(
                "Voice stress:",
                round(
                    vocal_stress,
                    2
                )
            )

            print(
                "Final stress:",
                stress
            )

            print(
                "Confidence:",
                confidence
            )

            print("===================================")


        except Exception as error:

            print("===================================")
            print("EMOTION ANALYSIS ERROR")
            print("===================================")

            print(error)

            stress_analysis = (
                "Emotion analysis could not be completed."
            )

            assessment = (

                "Speech transcription completed, "

                "but emotion analysis was unavailable."

            )


    # ========================================================
    # SUMMARY
    # ========================================================

    summary = (

        "Driver radio was transcribed successfully. "

        f"Detected mood: {mood}. "

        f"Stress level: {stress} / 100."

    )


    # ========================================================
    # RECOMMENDATIONS
    # ========================================================

    recommendations = []


    if stress >= 60:

        recommendations.append(

            "Monitor the driver's radio communication "

            "during high-pressure moments."

        )

        recommendations.append(

            "Review the driver's communication during "

            "high-pressure race moments."

        )


    elif stress >= 30:

        recommendations.append(

            "Continue monitoring changes in the "

            "driver's emotional state."

        )

        recommendations.append(

            "Review changes in the driver's emotional "

            "state during the race."

        )


    else:

        recommendations.append(

            "Driver communication currently appears "

            "relatively controlled."

        )

        recommendations.append(

            "Continue monitoring for changes during "

            "high-pressure race moments."

        )


    recommendations.append(

        "Continue monitoring communication patterns "

        "during critical race moments."

    )


    # ========================================================
    # SAVE TO DATABASE
    # ========================================================

    session.transcript = transcript

    session.mood = mood

    session.confidence = confidence

    session.stress = stress

    session.stress_analysis = stress_analysis

    session.assessment = assessment

    session.peak_stress = peak_stress

    session.summary = summary

    session.recommendations = recommendations


    session.save()


    # ========================================================
    # COMPLETE
    # ========================================================

    print("===================================")
    print("ANALYSIS COMPLETE")
    print("===================================")


    # ========================================================
    # RETURN TO FRONTEND
    # ========================================================

    return {

        "session_id": session.id,

        "status": "analysis_complete",

        "transcript": transcript,

        "mood": mood,

        "confidence": confidence,

        "stress": stress,

        "stress_analysis": stress_analysis,

        "assessment": assessment,

        "peak_stress": peak_stress,

        "summary": summary,

        "recommendations": recommendations,

        "lap_number": session.lap_number

    }