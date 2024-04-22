from django.contrib import admin
from django.db import models


class Part(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=30)
    part_xml = models.TextField()
    plan_image = models.ImageField(upload_to="plans", null=True, blank=True)
    plan_x_offset = models.IntegerField(default=0)
    plan_y_offset = models.IntegerField(default=0)

    def __str__(self):
        return self.name


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


class Item(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    text = models.CharField(max_length=100)
    icon = models.CharField(max_length=100)

    def __str__(self):
        return self.id


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


admin.site.register(Part)
admin.site.register(Department)
admin.site.register(Item)
admin.site.register(Purpose)
