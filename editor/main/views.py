import xml.etree.ElementTree as ET

from django.core.serializers import serialize
from django.shortcuts import redirect, render

from editor.main.forms import XMLUploadForm
from editor.main.models import Department, Item, Part, Pavilion, Purpose


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


def empty_editor(request):
    purposes = serialize("json", Purpose.objects.all())
    context = {"purposes": purposes}
    return render(request, "editor.html", context=context)


def xml_upload(request):
    if request.method == "POST":
        form = XMLUploadForm(request.POST, request.FILES)
        if form.is_valid():
            xml_file = request.FILES["xml_file"]
            tree = ET.parse(xml_file)
            root = tree.getroot()
            # Example: Print each child of the root
            for child in root:
                parse_element(child)
                # print(child.tag, created, child.attrib)
            return redirect("home")
    else:
        form = XMLUploadForm()

    return render(request, "upload.html", context={"form": form})


def parse_element(elem):
    elem_data = elem.attrib
    if elem.tag == "item":
        return parse_item(elem_data)
    elif elem.tag == "purpose":
        return parse_purpose(elem_data)
    elif elem.tag == "department":
        return parse_department(elem_data)
    elif elem.tag == "pavilion":
        return parse_pavilion(elem_data)
    elif elem.tag == "part":
        return parse_part(elem)


def parse_purpose(elem_data):
    purpose, created = Purpose.objects.get_or_create(
        id=elem_data["id"],
        text=elem_data.get("text", ""),
        icon=elem_data.get("icon", ""),
        colour=elem_data.get("colour", ""),
        interesting=True if (elem_data.get("interesting", False) == "true") else False,
        free_room_candidate=True if (elem_data.get("free-room-candidate", False) == "true") else False,
        default=True if (elem_data.get("default", False) == "true") else False,
    )
    return created


def parse_department(elem_data):
    department, created = Department.objects.get_or_create(id=elem_data["id"], type=elem_data["type"])
    return created


def parse_item(elem_data):
    item, created = Item.objects.get_or_create(
        id=elem_data["id"], defaults={"text": elem_data["text"], "icon": elem_data["icon"]}
    )
    return created


def parse_part(elem):
    elem_data = elem.attrib
    print(elem_data)
    part, created = Part.objects.get_or_create(
        name=elem_data["name"],
        part_xml=ET.tostring(elem, encoding="unicode", method="xml"),
        dx=int(elem_data["dx"]),
        dy=int(elem_data["dy"]),
        scale_x=elem_data["scalex"],
        scale_y=elem_data["scaley"],
        pavilion=elem_data["pavilion"],
    )
    return created


def parse_pavilion(elem_data):
    department, created = Pavilion.objects.get_or_create(
        id=elem_data["id"],
        name=elem_data["name"],
        ground_level=elem_data["ground-level"],
    )
    return created
