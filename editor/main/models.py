from django.contrib import admin
from django.db import models


class Part(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=30, unique=True)
    part_xml = models.TextField()
    plan_image = models.ImageField(upload_to="plans", null=True, blank=True)
    plan_x_offset = models.IntegerField(default=0)
    plan_y_offset = models.IntegerField(default=0)
    dx = models.IntegerField(default=0)
    dy = models.IntegerField(default=0)
    level = models.IntegerField(default=0)
    scale_x = models.FloatField(default=1)
    scale_y = models.FloatField(default=1)
    pavilion = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

    def to_xml(self, doc):
        part = doc.createElement(self.part_xml)
        return part


class PartAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Part._meta.fields if field.name != "id"]


class Department(models.Model):
    MATHEMATICAL = "mathematical"
    PHYSICAL = "physical"
    INFORMATICAL = "informatical"
    DIDACTIC = "didactic"
    SUPPORT = "support"

    DEPARTMENT_TYPES = [
        (MATHEMATICAL, "Mathematical"),
        (PHYSICAL, "Physical"),
        (INFORMATICAL, "Informatical"),
        (DIDACTIC, "Didactic"),
        (SUPPORT, "Support"),
    ]

    id = models.CharField(max_length=200, primary_key=True)  # Assuming the id is unique
    type = models.CharField(max_length=20, choices=DEPARTMENT_TYPES)

    def __str__(self):
        return self.id

    def to_xml(self, doc):
        department = doc.createElement("department")
        department.setAttribute("id", self.id)
        department.setAttribute("type", self.type)
        return department


class Item(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    text = models.CharField(max_length=100)
    icon = models.CharField(max_length=100)

    def __str__(self):
        return self.id

    def to_xml(self, doc):
        item = doc.createElement("item")
        item.setAttribute("id", self.id)
        item.setAttribute("text", self.text)
        item.setAttribute("icon", self.icon)
        return item


class Purpose(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    text = models.CharField(max_length=100)
    icon = models.CharField(max_length=100, blank=True, null=True)
    colour = models.CharField(max_length=20, blank=True, null=True)
    interesting = models.BooleanField(default=False)
    free_room_candidate = models.BooleanField(default=False)
    default = models.BooleanField(default=False)

    def __str__(self):
        return self.text

    def to_xml(self, doc):
        purpose = doc.createElement("purpose")

        purpose.setAttribute("id", self.id)
        purpose.setAttribute("text", self.text)

        if self.icon:
            purpose.setAttribute("icon", self.icon)
        if self.colour:
            purpose.setAttribute("colour", self.colour)
        if self.interesting:
            purpose.setAttribute("interesting", "true")
        if self.free_room_candidate:
            purpose.setAttribute("free-room-candidate", "true")
        if self.default:
            purpose.setAttribute("default", "true")

        return purpose


class Pavilion(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=100)
    ground_level = models.IntegerField(default=0)

    def to_xml(self, doc):
        pavilion = doc.createElement("pavilion")
        pavilion.setAttribute("id", self.id)
        pavilion.setAttribute("name", self.name)
        pavilion.setAttribute("ground-level", str(self.ground_level))
        return pavilion


admin.site.register(Part)
admin.site.register(Department)
admin.site.register(Item)
admin.site.register(Purpose)
admin.site.register(Pavilion)
