from django.shortcuts import render

from editor.main.models import Part


def home(request):
    parts = Part.objects.all()
    print(parts)
    context = {"parts": parts}
    return render(request, "home.html", context=context)


def editor(request, id):
    part = Part.objects.filter(id=id).get()
    context = {"part": part}
    return render(request, "editor.html", context=context)
