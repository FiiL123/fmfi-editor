from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("home", views.home, name="home"),
    path("editor/<int:id>", views.editor, name="editor"),
    path("editor", views.empty_editor, name="editor"),
    path("xml_upload", views.xml_upload, name="xml_upload"),
    path("part_xml/<int:id>/", views.receive_xml, name="receive_xml"),
    path("export_xml", views.export_xml, name="export_xml"),
    path("save-configurations/", views.save_configurations, name="save-configurations"),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
