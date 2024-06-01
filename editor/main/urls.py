from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from . import form_views, views

urlpatterns = [
    path("", views.home, name="home"),
    path("home", views.home, name="home"),
    path("editor/<int:id>", views.editor, name="editor"),
    path("editor", views.empty_editor, name="editor"),
    path("xml_upload", views.xml_upload, name="xml_upload"),
    path("part_xml/<int:id>/", views.receive_xml, name="receive_xml"),
    path("export_xml", views.export_xml, name="export_xml"),
    path("save-configurations/", views.save_configurations, name="save-configurations"),
    path("add_part/", form_views.add_part, name="add_part"),
    path("edit_part/<int:id>", form_views.edit_part, name="edit_part"),
    path("delete_part/<int:id>", form_views.delete_part, name="delete_part"),
    path("add_department/", form_views.add_department, name="add_department"),
    path("edit_department/<str:id>", form_views.edit_department, name="edit_department"),
    path("delete_department/<str:id>", form_views.delete_department, name="delete_department"),
    path("list_departments/", form_views.list_departments, name="list_departments"),
    path("add_item/", form_views.add_item, name="add_item"),
    path("edit_item/<str:id>", form_views.edit_item, name="edit_item"),
    path("delete_item/<str:id>", form_views.delete_item, name="delete_item"),
    path("list_items/", form_views.list_items, name="list_items"),
    path("add_purpose/", form_views.add_purpose, name="add_purpose"),
    path("edit_purpose/<str:id>", form_views.edit_purpose, name="edit_purpose"),
    path("delete_purpose/<str:id>", form_views.delete_purpose, name="delete_purpose"),
    path("list_purposes/", form_views.list_purposes, name="list_purposes"),
    path("add_pavilion/", form_views.add_pavilion, name="add_pavilion"),
    path("edit_pavilion/<str:id>", form_views.edit_pavilion, name="edit_pavilion"),
    path("delete_pavilion/<str:id>", form_views.delete_pavilion, name="delete_pavilion"),
    path("list_pavilions/", form_views.list_pavilions, name="list_pavilions"),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
