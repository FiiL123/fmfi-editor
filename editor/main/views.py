from django.shortcuts import render

from editor.main.models import Part


def home(request):
    parts = Part.objects.all()
    print(parts)
    context = {"parts": parts}
    return render(request, "home.html", context=context)


def editor(request, id):
    plan = Part.objects.filter(id=id).get()
    image = plan.plan_image
    context = {"image": image}
    print(image.url)
    return render(request, "editor.html", context=context)
