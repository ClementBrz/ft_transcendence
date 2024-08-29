from django.urls import path
from . import views
# from api.views import CustomUserAPIView

urlpatterns = [
	# path('', views.getData),
	# path('add/', views.addUser),
	# path('', CustomUserAPIView.as_view()),
	path('check-email/', views.check_existing_email, name='check-email'),
	path('check-username/', views.check_existing_username, name='check-username'),
	path('register/', views.addUser, name='register'),
]
