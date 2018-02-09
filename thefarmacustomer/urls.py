from django.conf.urls import url, include

from app import urls

urlpatterns = [
    url(r'^', include(urls))
]

urlpatterns += [
    url(r'^django-rq/', include('django_rq.urls')),
]