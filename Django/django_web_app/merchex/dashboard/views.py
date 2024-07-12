from django.http import HttpResponse
from django.shortcuts import render
from dashboard.models import User

# def dashboard(request):
#     users = User.objects.all()
#     return render(request, 'dashboard.html',
# 				{ 'users': users })
    
# def users(request):
#     return HttpResponse('<h1>Jess</h1>')

from django.http import HttpResponse

def dashboard_view(request):
    users = User.objects.all()
    return render(request, 'dashboard.html',
				{ 'users': users })