from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from .models import RaceSession
from .serializers import RaceSessionSerializer
from .services import process_race_audio


class UploadRaceRadio(APIView):

    parser_classes = [
        MultiPartParser,
        FormParser
    ]

    def post(self, request):

        print("===================================")
        print("NEW RACE RADIO REQUEST")
        print("===================================")

        serializer = RaceSessionSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            print("SERIALIZER ERROR:")
            print(serializer.errors)

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        session = serializer.save()

        print("SESSION CREATED:")
        print(session.id)

        print("DRIVER:", session.driver_name)
        print("TEAM:", session.team)
        print("TRACK:", session.track)
        print("LAP:", session.lap_number)

        print("AUDIO FILE:")
        print(session.audio_file.path)

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

                "audio_file":
                    session.audio_file.url
            },

            status=status.HTTP_201_CREATED
        )


class AnalyzeRaceRadio(APIView):

    def post(self, request, session_id):

        try:

            session = RaceSession.objects.get(
                id=session_id
            )

        except RaceSession.DoesNotExist:

            return Response(
                {
                    "error":
                        "Race session not found."
                },

                status=status.HTTP_404_NOT_FOUND
            )

        try:

            result = process_race_audio(
                session
            )

            return Response(
                {
                    "message":
                        "Race audio processed successfully.",

                    **result,

                    "lap":
                        session.lap_number
                },

                status=status.HTTP_200_OK
            )

        except Exception as error:

            print("ANALYSIS ERROR:")
            print(error)

            return Response(
                {
                    "error":
                        str(error)
                },

                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )