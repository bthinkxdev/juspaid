from django.shortcuts import render

from .models import GalleryUpdate


def home(request):
    return render(request, "pages/home.html")


def about(request):
    return render(request, "pages/about.html")


def group_farming(request):
    return render(request, "pages/group_farming.html")


def cave_resort(request):
    return render(request, "pages/cave_resort.html")


def farm_forest(request):
    return render(request, "pages/farm_forest.html")


def projects(request):
    return render(request, "pages/projects.html")


def invest(request):
    return render(request, "pages/invest.html")


def gallery(request):
    updates = GalleryUpdate.objects.filter(is_published=True)
    return render(request, "pages/gallery.html", {"updates": updates})


def contact(request):
    return render(request, "pages/contact.html")


def terms(request):
    return render(request, "pages/terms.html")
