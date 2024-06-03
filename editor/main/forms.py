from django import forms

from .models import Department, Item, Part, Pavilion, Purpose


class XMLUploadForm(forms.Form):
    xml_file = forms.FileField()
    delete_all = forms.BooleanField(required=False, label="Wipe all data (Parts, Departments, Purposes etc..)")


class PartForm(forms.ModelForm):
    class Meta:
        model = Part
        fields = "__all__"  # Include all fields from the model

        # Optional: Customize widgets for better user experience
        widgets = {
            "name": forms.TextInput(attrs={"class": "form-control"}),
            "part_xml": forms.Textarea(attrs={"class": "codemirror-textarea form-control"}),
            "plan_image": forms.ClearableFileInput(attrs={"class": "form-control"}),
            "plan_x_offset": forms.NumberInput(attrs={"class": "form-control"}),
            "plan_y_offset": forms.NumberInput(attrs={"class": "form-control"}),
            "dx": forms.NumberInput(attrs={"class": "form-control"}),
            "dy": forms.NumberInput(attrs={"class": "form-control"}),
            "level": forms.NumberInput(attrs={"class": "form-control"}),
            "scale_x": forms.NumberInput(attrs={"class": "form-control"}),
            "scale_y": forms.NumberInput(attrs={"class": "form-control"}),
            "pavilion": forms.TextInput(attrs={"class": "form-control"}),
        }

    def __init__(self, *args, **kwargs):
        super(PartForm, self).__init__(*args, **kwargs)
        self.fields["part_xml"].initial = "<part></part>"


class DepartmentForm(forms.ModelForm):
    class Meta:
        model = Department
        fields = "__all__"
        widgets = {
            "id": forms.TextInput(attrs={"class": "form-control"}),
            "type": forms.Select(attrs={"class": "form-control"}),
        }


class ItemForm(forms.ModelForm):
    class Meta:
        model = Item
        fields = "__all__"
        widgets = {
            "id": forms.TextInput(attrs={"class": "form-control"}),
            "text": forms.TextInput(attrs={"class": "form-control"}),
            "icon": forms.TextInput(attrs={"class": "form-control"}),
        }


class PurposeForm(forms.ModelForm):
    class Meta:
        model = Purpose
        fields = "__all__"
        widgets = {
            "id": forms.TextInput(attrs={"class": "form-control"}),
            "text": forms.TextInput(attrs={"class": "form-control"}),
            "icon": forms.TextInput(attrs={"class": "form-control"}),
            "colour": forms.TextInput(attrs={"class": "form-control"}),
            "interesting": forms.CheckboxInput(attrs={"class": "form-check-input"}),
            "free_room_candidate": forms.CheckboxInput(attrs={"class": "form-check-input"}),
            "default": forms.CheckboxInput(attrs={"class": "form-check-input"}),
        }


class PavilionForm(forms.ModelForm):
    class Meta:
        model = Pavilion
        fields = "__all__"
        widgets = {
            "id": forms.TextInput(attrs={"class": "form-control"}),
            "name": forms.TextInput(attrs={"class": "form-control"}),
            "ground_level": forms.NumberInput(attrs={"class": "form-control"}),
        }
