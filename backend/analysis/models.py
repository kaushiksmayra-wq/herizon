from django.db import models


class RaceSession(models.Model):

    driver_name = models.CharField(max_length=100)

    team = models.CharField(max_length=100)

    track = models.CharField(max_length=100)

    lap_number = models.IntegerField()


    audio_file = models.FileField(
        upload_to="race_audio/"
    )


    transcript = models.TextField(
        blank=True,
        null=True
    )


    mood = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )


    mood_confidence = models.FloatField(
        blank=True,
        null=True
    )


    stress_level = models.IntegerField(
        blank=True,
        null=True
    )


    recommendation = models.TextField(
        blank=True,
        null=True
    )


    created_at = models.DateTimeField(
        auto_now_add=True
    )


    def __str__(self):
        return self.driver_name