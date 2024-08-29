from django.urls import path
from . import views

urlpatterns = [
	path('api/getData/', views.getData, name='get_data'),
	path('add/', views.addStats),
	path('', views.getData),
]