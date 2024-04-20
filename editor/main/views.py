from django.core.serializers import serialize
from django.shortcuts import render

from editor.main.models import Part, Purpose


def home(request):
    parts = Part.objects.all()
    print(parts)
    context = {"parts": parts}
    return render(request, "home.html", context=context)


def editor(request, id):
    part = Part.objects.filter(id=id).get()
    purposes = serialize("json", Purpose.objects.all())
    context = {"part": part, "purposes": purposes}
    return render(request, "editor.html", context=context)
