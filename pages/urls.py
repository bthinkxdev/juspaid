from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("about/", views.about, name="about"),
    path("group-farming/", views.group_farming, name="group_farming"),
    path("cave-resort/", views.cave_resort, name="cave_resort"),
    path("farm-forest/", views.farm_forest, name="farm_forest"),
    path("projects/", views.projects, name="projects"),
    path("invest/", views.invest, name="invest"),
    path("gallery/", views.gallery, name="gallery"),
    path("contact/", views.contact, name="contact"),
    path("terms/", views.terms, name="terms"),
]
