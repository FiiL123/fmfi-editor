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


def list_departments(request):
    return list_objects(request, Department, "department")


def add_item(request):
    return add_object(request, form_class=ItemForm, html="forms/item.html")


def edit_item(request, id):
    return edit_object(request, id, object_class=Item, form_class=ItemForm, html="forms/item.html")


def delete_item(request, id):
    return delete_object(id, Item)


def list_items(request):
    return list_objects(request, Item, "item")


def add_purpose(request):
    return add_object(request, form_class=PurposeForm, html="forms/purpose.html")


def edit_purpose(request, id):
    return edit_object(request, id, object_class=Purpose, form_class=PurposeForm, html="forms/purpose.html")


def delete_purpose(request, id):
    return delete_object(id, Purpose)


def list_purposes(request):
    return list_objects(request, Purpose, "purpose")


def add_pavilion(request):
    return add_object(request, form_class=PavilionForm, html="forms/pavilion.html")


def edit_pavilion(request, id):
    return edit_object(request, id, object_class=Pavilion, form_class=PavilionForm, html="forms/pavilion.html")


def delete_pavilion(request, id):
    return delete_object(id, Pavilion)


def list_pavilions(request):
    return list_objects(request, Pavilion, "pavilion")


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
    print(id, object_class)
    instance = get_object_or_404(object_class, id=id)
    if request.method == "POST":
        form = form_class(request.POST, request.FILES, instance=instance)
        if form.is_valid():
            new_id = form.cleaned_data["id"] if "id" in form.cleaned_data else id
            obj = form.save()
            if new_id != id:
                obj.pk = new_id
                obj.save()
                object_class.objects.get(id=id).delete()
            return redirect("home")
    else:
        form = form_class(instance=instance)

    return render(request, html, {"form": form})


def delete_object(id, object_class):
    instance = get_object_or_404(object_class, id=id)
    instance.delete()
    return redirect("home")


def list_objects(request, object_class, name):
    objects = object_class.objects.all().order_by("id")
    return render(request, "forms/list.html", context={"objects": objects, "name": name})
