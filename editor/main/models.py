from django.contrib import admin
from django.db import models


class Part(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=30)
    part_xml = models.TextField()
    plan_image = models.ImageField(upload_to="plans")

    def __str__(self):
        return self.name


class PartAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Part._meta.fields if field.name != "id"]


admin.site.register(Part)
