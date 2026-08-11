from django.urls import path

from .views import UploadRaceRadio, AnalyzeRaceRadio


urlpatterns = [

    path(
        "upload/",
        UploadRaceRadio.as_view(),
        name="upload-race-radio"
    ),

    path(
        "analyze/<int:session_id>/",
        AnalyzeRaceRadio.as_view(),
        name="analyze-race-radio"
    ),

]