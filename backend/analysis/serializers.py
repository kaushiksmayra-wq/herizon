from rest_framework import serializers
from .models import RaceSession


class RaceSessionSerializer(serializers.ModelSerializer):

    class Meta:
        model = RaceSession
        fields = "__all__"