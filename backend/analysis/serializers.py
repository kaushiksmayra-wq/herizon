from rest_framework import serializers

from .models import RaceSession


class RaceSessionSerializer(serializers.ModelSerializer):

    class Meta:

        model = RaceSession

        fields = [
            "id",

            "driver_name",

            "team",

            "track",

            "lap_number",

            "audio_file",

            "transcript",

            "mood",

            "confidence",

            "stress",

            "stress_analysis",

            "assessment",

            "peak_stress",

            "summary",

            "recommendations",

            "created_at",
        ]

        read_only_fields = [
            "id",

            "transcript",

            "mood",

            "confidence",

            "stress",

            "stress_analysis",

            "assessment",

            "peak_stress",

            "summary",

            "recommendations",

            "created_at",
        ]