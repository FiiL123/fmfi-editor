from django.shortcuts import render


def home(request):
    return render(request, "home.html")


def editor(request):
    return render(request, "editor.html")
