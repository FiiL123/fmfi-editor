from django.shortcuts import get_object_or_404, redirect, render

from .forms import DepartmentForm, ItemForm, PartForm, PavilionForm, PurposeForm
from .models import Department, Item, Part, Pavilion, Purpose


def add_part(request):
    return add_object(request, form_class=PartForm, html="forms/part.html")


def edit_part(request, id):
    return edit_object(request, id=id, object_class=Part, form_class=PartForm, html="forms/part.html")


def delete_part(request, id):
    return delete_object(id, Part)


def add_department(request):
    return add_object(request, form_class=DepartmentForm, html="forms/department.html")


def edit_department(request, id):
    return edit_object(request, id, object_class=Department, form_class=DepartmentForm, html="forms/department.html")


def delete_department(request, id):
    return delete_object(id, Department)


def add_item(request):
    return add_object(request, form_class=ItemForm, html="forms/item.html")


def edit_item(request, id):
    return edit_object(request, id, object_class=Item, form_class=ItemForm, html="forms/item.html")


def delete_item(request, id):
    return delete_object(id, Item)


def add_purpose(request):
    return add_object(request, form_class=PurposeForm, html="forms/purpose.html")


def edit_purpose(request, id):
    return edit_object(request, id, object_class=Purpose, form_class=PurposeForm, html="forms/purpose.html")


def delete_purpose(request, id):
    return delete_object(id, Item)


def add_pavilion(request):
    return add_object(request, form_class=PavilionForm, html="forms/pavilion.html")


def edit_pavilion(request, id):
    return edit_object(request, id, object_class=Pavilion, form_class=PavilionForm, html="forms/pavilion.html")


def delete_pavilion(request, id):
    return delete_object(id, Item)


def add_object(request, form_class, html):
    if request.method == "POST":
        form = form_class(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect("home")  # Redirect to a list of parts or another page
    else:
        form = form_class()
    return render(request, html, {"form": form})


def edit_object(request, id, object_class, form_class, html):
    instance = get_object_or_404(object_class, id=id)
    if request.method == "POST":
        form = form_class(request.POST, instance=instance)

        if form.is_valid():
            form.save()
            return redirect("home")
    else:
        form = form_class(instance=instance)

    return render(request, html, {"form": form})


def delete_object(id, object_class):
    instance = get_object_or_404(object_class, id=id)
    instance.delete()
    return redirect("home")
