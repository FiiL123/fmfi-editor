# Generated by Django 5.0.2 on 2024-04-29 13:46

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0005_rename_plan_x_offset_part_dx_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="Pavilion",
            fields=[
                ("id", models.CharField(max_length=100, primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=100)),
                ("ground_level", models.IntegerField(default=0)),
            ],
        ),
    ]
