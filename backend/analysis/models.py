from django.db import models


class RaceSession(models.Model):

    driver_name = models.CharField(
        max_length=100
    )

    team = models.CharField(
        max_length=100
    )

    track = models.CharField(
        max_length=100
    )

    lap_number = models.IntegerField()

    audio_file = models.FileField(
        upload_to="race_audio/"
    )

    transcript = models.TextField(
        blank=True,
        null=True
    )

    mood = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    confidence = models.FloatField(
        blank=True,
        null=True
    )

    stress = models.FloatField(
        blank=True,
        null=True
    )

    stress_analysis = models.TextField(
        blank=True,
        null=True
    )

    assessment = models.TextField(
        blank=True,
        null=True
    )

    peak_stress = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    summary = models.TextField(
        blank=True,
        null=True
    )

    recommendations = models.JSONField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.driver_name