from django.urls import path
from .views import UploadRaceRadio


urlpatterns = [

    path(
        "upload/",
        UploadRaceRadio.as_view(),
        name="upload-race-radio"
    ),

]