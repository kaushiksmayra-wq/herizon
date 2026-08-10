from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import RaceSessionSerializer

from .ai import (
    transcribe_audio,
    analyze_emotion,
    generate_recommendation
)



class UploadRaceRadio(APIView):


    parser_classes = [
        MultiPartParser,
        FormParser
    ]



    def post(self, request):


        serializer = RaceSessionSerializer(
            data=request.data
        )



        if serializer.is_valid():


            session = serializer.save()


            audio_path = session.audio_file.path



            # ==========================
            # WHISPER TRANSCRIPTION
            # ==========================


            try:


                transcript = transcribe_audio(
                    audio_path
                )


            except Exception as e:


                print(
                    "WHISPER ERROR:",
                    e
                )


                transcript = (
                    "No clear transcript generated."
                )





            # ==========================
            # EMOTION ANALYSIS
            # ==========================


            try:


                emotion = analyze_emotion(
                    transcript
                )


            except Exception as e:


                print(
                    "EMOTION ERROR:",
                    e
                )


                emotion = {


                    "mood":
                    "Unavailable",


                    "confidence":
                    0,


                    "stress":
                    0,


                    "assessment":
                    "Analysis failed",


                    "stress_analysis":
                    "Unable to analyse driver communication."

                }





            # ==========================
            # RECOMMENDATION
            # ==========================


            recommendation = generate_recommendation(

                transcript,

                emotion

            )






            return Response(

                {


                    "message":
                    "Race radio uploaded successfully",



                    "session_id":
                    session.id,



                    "driver":
                    session.driver_name,



                    "team":
                    session.team,



                    "track":
                    session.track,



                    "lap":
                    session.lap_number,





                    # AI DATA


                    "transcript":
                    transcript,



                    "mood":
                    recommendation["mood"],



                    "confidence":
                    recommendation["confidence"],



                    "stress":
                    recommendation["stress"],



                    "stress_analysis":
                    recommendation["stress_analysis"],



                    "assessment":
                    recommendation["assessment"],



                    "peakStress":
                    "Detected during radio analysis",



                    "summary":
                    recommendation["summary"],



                    "recommendations":
                    recommendation["recommendations"]


                },


                status=status.HTTP_201_CREATED

            )




        return Response(

            serializer.errors,

            status=status.HTTP_400_BAD_REQUEST

        )